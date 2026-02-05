from decimal import Decimal
from django.db import transaction

from common.errors import InsufficientFunds, InvalidMarket, OrderNotCancelable
from common.constants import (
    ORDER_SIDE_BUY,
    ORDER_SIDE_SELL,
    ORDER_TYPE_LIMIT,
    ORDER_STATUS_OPEN,
    LEDGER_KIND_LOCK,
    LEDGER_KIND_UNLOCK,
)
from common.money import quantize_usdt, quantize_btc
from apps.markets.models import Market
from apps.wallet.models import Balance
from apps.wallet.services import add_ledger
from .fee_service import compute_order_fee
from .matching_engine import match_order
from ..models import Order


def create_limit_order(user, market_symbol: str, side: str, price: Decimal, amount: Decimal) -> Order:
    if price <= 0 or amount <= 0:
        raise ValueError("price and amount must be positive")
    try:
        market = Market.objects.get(symbol=market_symbol, is_active=True)
    except Market.DoesNotExist:
        raise InvalidMarket()
    base_code = market.base_asset.code
    quote_code = market.quote_asset.code
    price = quantize_usdt(price)
    amount = quantize_btc(amount) if base_code == "BTC" else amount

    with transaction.atomic():
        if side == ORDER_SIDE_BUY:
            cost = price * amount
            fee = compute_order_fee(cost)
            total = cost + fee
            bal = Balance.objects.select_for_update().get(user=user, asset_code=quote_code)
            if bal.available < total:
                raise InsufficientFunds()
            bal.available -= total
            bal.locked += total
            bal.save(update_fields=["available", "locked"])
            order = Order.objects.create(
                user=user,
                market_symbol=market_symbol,
                side=ORDER_SIDE_BUY,
                type=ORDER_TYPE_LIMIT,
                price=price,
                amount=amount,
                filled_amount=Decimal("0"),
                status=ORDER_STATUS_OPEN,
            )
            add_ledger(user, quote_code, -total, LEDGER_KIND_LOCK, {"order_id": order.id})
        else:
            bal = Balance.objects.select_for_update().get(user=user, asset_code=base_code)
            if bal.available < amount:
                raise InsufficientFunds()
            bal.available -= amount
            bal.locked += amount
            bal.save(update_fields=["available", "locked"])
            order = Order.objects.create(
                user=user,
                market_symbol=market_symbol,
                side=ORDER_SIDE_SELL,
                type=ORDER_TYPE_LIMIT,
                price=price,
                amount=amount,
                filled_amount=Decimal("0"),
                status=ORDER_STATUS_OPEN,
            )
            add_ledger(user, base_code, -amount, LEDGER_KIND_LOCK, {"order_id": order.id})
        match_order(order)
    return order


def cancel_order(user, order_id: int) -> Order:
    from common.constants import ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED, ORDER_STATUS_CANCELED
    with transaction.atomic():
        order = Order.objects.select_for_update().get(id=order_id, user=user)
        if order.status not in (ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED):
            raise OrderNotCancelable()
        market = Market.objects.get(symbol=order.market_symbol)
        base_code = market.base_asset.code
        quote_code = market.quote_asset.code
        remaining = order.amount - order.filled_amount
        if order.side == ORDER_SIDE_BUY:
            cost = order.price * remaining
            fee = compute_order_fee(cost)
            total = cost + fee
            bal = Balance.objects.select_for_update().get(user=user, asset_code=quote_code)
            bal.locked -= total
            bal.available += total
            bal.save(update_fields=["available", "locked"])
            add_ledger(user, quote_code, total, LEDGER_KIND_UNLOCK, {"order_id": order.id})
        else:
            bal = Balance.objects.select_for_update().get(user=user, asset_code=base_code)
            bal.locked -= remaining
            bal.available += remaining
            bal.save(update_fields=["available", "locked"])
            add_ledger(user, base_code, remaining, LEDGER_KIND_UNLOCK, {"order_id": order.id})
        order.status = ORDER_STATUS_CANCELED
        order.save(update_fields=["status"])
        from apps.realtime.services import broadcast_orderbook_update, send_order_update
        broadcast_orderbook_update(order.market_symbol)
        send_order_update(user.id, order.id, order.status, str(order.filled_amount))
    return order
