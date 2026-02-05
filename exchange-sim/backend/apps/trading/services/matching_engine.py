from decimal import Decimal
from django.db import transaction

from common.constants import (
    ORDER_SIDE_BUY,
    ORDER_SIDE_SELL,
    ORDER_STATUS_OPEN,
    ORDER_STATUS_PARTIALLY_FILLED,
    ORDER_STATUS_FILLED,
)
from ..models import Order, Trade
from .settlement_service import settle_trade
from apps.analytics.services import update_market_stats_after_trade
from apps.realtime.services import broadcast_trade, broadcast_ticker, broadcast_orderbook_update


def match_order(incoming: Order) -> None:
    if incoming.side == ORDER_SIDE_BUY:
        counter_queryset = (
            Order.objects.filter(
                market_symbol=incoming.market_symbol,
                side=ORDER_SIDE_SELL,
                status__in=(ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED),
                price__lte=incoming.price,
            )
            .order_by("price", "created_at")
            .select_for_update()
        )
    else:
        counter_queryset = (
            Order.objects.filter(
                market_symbol=incoming.market_symbol,
                side=ORDER_SIDE_BUY,
                status__in=(ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED),
                price__gte=incoming.price,
            )
            .order_by("-price", "created_at")
            .select_for_update()
        )

    remaining_new = incoming.amount - incoming.filled_amount
    if remaining_new <= 0:
        return

    for counter in counter_queryset:
        if remaining_new <= 0:
            break
        remaining_counter = counter.amount - counter.filled_amount
        if remaining_counter <= 0:
            continue
        trade_amount = min(remaining_new, remaining_counter)
        trade_price = counter.price
        with transaction.atomic():
            trade = Trade.objects.create(
                market_symbol=incoming.market_symbol,
                price=trade_price,
                amount=trade_amount,
                buy_order=incoming if incoming.side == ORDER_SIDE_BUY else counter,
                sell_order=counter if incoming.side == ORDER_SIDE_SELL else incoming,
                taker_side=incoming.side,
            )
            settle_trade(trade)
            update_market_stats_after_trade(incoming.market_symbol, trade_price, trade_amount)
            broadcast_trade(incoming.market_symbol, trade_price, trade_amount, incoming.side)
            broadcast_ticker(incoming.market_symbol, trade_price)
            broadcast_orderbook_update(incoming.market_symbol)
            incoming.filled_amount += trade_amount
            counter.filled_amount += trade_amount
            incoming.status = (
                ORDER_STATUS_FILLED if incoming.filled_amount >= incoming.amount else ORDER_STATUS_PARTIALLY_FILLED
            )
            counter.status = (
                ORDER_STATUS_FILLED if counter.filled_amount >= counter.amount else ORDER_STATUS_PARTIALLY_FILLED
            )
            incoming.save(update_fields=["filled_amount", "status"])
            counter.save(update_fields=["filled_amount", "status"])
        remaining_new -= trade_amount
