from decimal import Decimal
from django.db import transaction

from common.constants import (
    ORDER_SIDE_BUY,
    LEDGER_KIND_TRADE,
    LEDGER_KIND_FEE,
    LEDGER_KIND_UNLOCK,
)
from common.money import quantize_btc, quantize_usdt
from apps.markets.models import Market
from apps.wallet.models import Balance
from apps.wallet.services import add_ledger
from .fee_service import compute_order_fee
from ..models import Order, Trade


def settle_trade(trade: Trade) -> None:
    market = Market.objects.get(symbol=trade.market_symbol)
    base_code = market.base_asset.code
    quote_code = market.quote_asset.code
    buy_order = trade.buy_order
    sell_order = trade.sell_order
    price = trade.price
    amount = trade.amount
    cost = quantize_usdt(price * amount)
    fee = compute_order_fee(cost)
    amount_q = quantize_btc(amount) if base_code == "BTC" else amount

    with transaction.atomic():
        buy_bal = Balance.objects.select_for_update().get(user=buy_order.user, asset_code=base_code)
        buy_bal.available += amount_q
        buy_bal.save(update_fields=["available"])
        add_ledger(
            buy_order.user,
            base_code,
            amount_q,
            LEDGER_KIND_TRADE,
            {"trade_id": trade.id, "order_id": buy_order.id},
        )
        cost_plus_fee = cost + fee
        buy_quote = Balance.objects.select_for_update().get(user=buy_order.user, asset_code=quote_code)
        buy_quote.locked -= cost_plus_fee
        buy_quote.save(update_fields=["locked"])
        if buy_order.filled_amount + amount >= buy_order.amount:
            remainder = buy_order.amount - buy_order.filled_amount - amount
            if remainder > 0:
                unlock_q = (buy_order.price * remainder) + compute_order_fee(buy_order.price * remainder)
                buy_quote.available += unlock_q
                buy_quote.locked -= unlock_q
                buy_quote.save(update_fields=["available", "locked"])
                add_ledger(buy_order.user, quote_code, unlock_q, LEDGER_KIND_UNLOCK, {"order_id": buy_order.id})

        sell_bal = Balance.objects.select_for_update().get(user=sell_order.user, asset_code=base_code)
        sell_bal.locked -= amount_q
        sell_bal.save(update_fields=["locked"])
        if sell_order.filled_amount + amount >= sell_order.amount:
            remainder = sell_order.amount - sell_order.filled_amount - amount
            if remainder > 0:
                sell_bal.available += remainder
                sell_bal.save(update_fields=["available"])
                add_ledger(sell_order.user, base_code, remainder, LEDGER_KIND_UNLOCK, {"order_id": sell_order.id})
        sell_quote = Balance.objects.select_for_update().get(user=sell_order.user, asset_code=quote_code)
        sell_quote.available += cost - fee
        sell_quote.save(update_fields=["available"])
        add_ledger(
            sell_order.user,
            quote_code,
            cost - fee,
            LEDGER_KIND_TRADE,
            {"trade_id": trade.id, "order_id": sell_order.id},
        )
        add_ledger(
            sell_order.user,
            quote_code,
            -fee,
            LEDGER_KIND_FEE,
            {"trade_id": trade.id},
        )
        from apps.realtime.services import send_balance_update
        send_balance_update(buy_order.user_id, base_code, str(buy_bal.available), str(buy_bal.locked))
        send_balance_update(buy_order.user_id, quote_code, str(buy_quote.available), str(buy_quote.locked))
        send_balance_update(sell_order.user_id, base_code, str(sell_bal.available), str(sell_bal.locked))
        send_balance_update(sell_order.user_id, quote_code, str(sell_quote.available), str(sell_quote.locked))
