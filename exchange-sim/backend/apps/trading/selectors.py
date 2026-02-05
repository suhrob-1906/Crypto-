from django.db.models import Sum
from .models import Order

ORDER_BOOK_LIMIT = 50


def get_orderbook_bids(market_symbol: str, limit: int = ORDER_BOOK_LIMIT):
    from common.constants import ORDER_SIDE_BUY, ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED
    from django.db.models import F
    qs = (
        Order.objects.filter(
            market_symbol=market_symbol,
            side=ORDER_SIDE_BUY,
            status__in=(ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED),
        )
        .values("price")
        .annotate(total_qty=Sum(F("amount") - F("filled_amount")))
        .order_by("-price")[:limit]
    )
    return [[str(item["price"]), str(item["total_qty"])] for item in qs]


def get_orderbook_asks(market_symbol: str, limit: int = ORDER_BOOK_LIMIT):
    from common.constants import ORDER_SIDE_SELL, ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED
    from django.db.models import F
    qs = (
        Order.objects.filter(
            market_symbol=market_symbol,
            side=ORDER_SIDE_SELL,
            status__in=(ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED),
        )
        .values("price")
        .annotate(total_qty=Sum(F("amount") - F("filled_amount")))
        .order_by("price")[:limit]
    )
    return [[str(item["price"]), str(item["total_qty"])] for item in qs]
