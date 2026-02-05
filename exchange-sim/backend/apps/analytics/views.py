from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import MarketStats


class MarketStatsView(APIView):
    def get(self, request):
        symbol = request.query_params.get("symbol")
        if not symbol:
            return Response({"error": "symbol required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            stats = MarketStats.objects.get(market_symbol=symbol)
        except MarketStats.DoesNotExist:
            return Response({
                "market_symbol": symbol,
                "last_price": "0",
                "volume_24h_quote": "0",
                "high_24h": "0",
                "low_24h": "0",
                "trades_24h": 0,
                "updated_at": None,
            })
        return Response({
            "market_symbol": stats.market_symbol,
            "last_price": str(stats.last_price),
            "volume_24h_quote": str(stats.volume_24h_quote),
            "high_24h": str(stats.high_24h),
            "low_24h": str(stats.low_24h),
            "trades_24h": stats.trades_24h,
            "updated_at": stats.updated_at.isoformat() if stats.updated_at else None,
        })


class TopMarketsView(APIView):
    def get(self, request):
        limit = int(request.query_params.get("limit", 10))
        stats = MarketStats.objects.all().order_by("-volume_24h_quote")[:limit]
        return Response([
            {
                "market_symbol": s.market_symbol,
                "last_price": str(s.last_price),
                "volume_24h_quote": str(s.volume_24h_quote),
                "high_24h": str(s.high_24h),
                "low_24h": str(s.low_24h),
                "trades_24h": s.trades_24h,
            }
            for s in stats
        ])
