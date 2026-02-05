from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.utils import timezone

from apps.trading.selectors import get_orderbook_bids, get_orderbook_asks


def _send(channel_name: str, event: str, data: dict):
    layer = get_channel_layer()
    if not layer:
        return
    async_to_sync(layer.group_send)(
        channel_name,
        {"type": "broadcast", "event": event, "data": data},
    )


def broadcast_ticker(symbol: str, price):
    ts = int(timezone.now().timestamp() * 1000)
    _send(f"market_{symbol}_ticker", "ticker:update", {"symbol": symbol, "price": str(price), "ts": ts})


def broadcast_orderbook_update(symbol: str):
    bids = get_orderbook_bids(symbol)
    asks = get_orderbook_asks(symbol)
    ts = int(timezone.now().timestamp() * 1000)
    _send(
        f"market_{symbol}_orderbook",
        "orderbook:update",
        {"symbol": symbol, "bids": bids, "asks": asks, "ts": ts},
    )


def broadcast_trade(symbol: str, price, amount, taker_side: str):
    ts = int(timezone.now().timestamp() * 1000)
    _send(
        f"market_{symbol}_trades",
        "trade:new",
        {"symbol": symbol, "price": str(price), "amount": str(amount), "takerSide": taker_side, "ts": ts},
    )


def send_order_update(user_id: int, order_id: int, status: str, filled_amount: str):
    _send(
        f"user_{user_id}",
        "order:update",
        {"orderId": order_id, "status": status, "filledAmount": filled_amount},
    )


def send_balance_update(user_id: int, asset: str, available: str, locked: str):
    _send(
        f"user_{user_id}",
        "balance:update",
        {"asset": asset, "available": available, "locked": locked},
    )
