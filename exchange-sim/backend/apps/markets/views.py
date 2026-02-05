from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Market
from .serializers import MarketSerializer
from .services import fetch_binance_ticker, fetch_binance_klines


class MarketListView(generics.ListAPIView):
    queryset = Market.objects.filter(is_active=True).select_related("base_asset", "quote_asset")
    serializer_class = MarketSerializer


class TickerView(APIView):
    def get(self, request, symbol):
        data = fetch_binance_ticker(symbol)
        return Response({
            "symbol": data["symbol"],
            "price": data["price"],
            "ts": data.get("time"),
        })


class CandlesView(APIView):
    def get(self, request, symbol):
        interval = request.query_params.get("interval", "1d")
        limit = min(int(request.query_params.get("limit", 365)), 500)
        raw = fetch_binance_klines(symbol, interval=interval, limit=limit)
        candles = [
            {
                "time": row[0] // 1000,
                "open": row[1],
                "high": row[2],
                "low": row[3],
                "close": row[4],
                "volume": row[5],
            }
            for row in raw
        ]
        return Response(candles)
