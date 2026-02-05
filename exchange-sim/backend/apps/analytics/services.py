from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Min, Max, Count, F

from .models import MarketStats
from apps.trading.models import Trade


def update_market_stats_after_trade(market_symbol: str, trade_price: Decimal, trade_amount: Decimal) -> None:
    since = timezone.now() - timezone.timedelta(hours=24)
    qs = Trade.objects.filter(market_symbol=market_symbol, created_at__gte=since)
    agg = qs.aggregate(
        volume=Sum(F("price") * F("amount")),
        low=Min("price"),
        high=Max("price"),
        count=Count("id"),
    )
    volume_24h = agg["volume"] or Decimal("0")
    low_24h = agg["low"] if agg["low"] is not None else trade_price
    high_24h = agg["high"] if agg["high"] is not None else trade_price
    trades_24h = agg["count"] or 0
    stats, created = MarketStats.objects.get_or_create(
        market_symbol=market_symbol,
        defaults={
            "last_price": trade_price,
            "volume_24h_quote": volume_24h,
            "high_24h": high_24h,
            "low_24h": low_24h,
            "trades_24h": trades_24h,
        },
    )
    if not created:
        stats.last_price = trade_price
        stats.volume_24h_quote = volume_24h
        stats.low_24h = low_24h
        stats.high_24h = high_24h
        stats.trades_24h = trades_24h
        stats.save(update_fields=["last_price", "volume_24h_quote", "low_24h", "high_24h", "trades_24h", "updated_at"])
