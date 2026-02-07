from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import services

class ExchangeInfoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = services.get_exchange_info()
        if not data:
            return Response(
                {"error": "Service unavailable"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Filter symbols if needed, or return full list
        # detailed filtering can be added later
        return Response(data)


class Ticker24hView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, symbol):
        data = services.get_ticker_24h(symbol)
        if not data:
            return Response(
                {"error": "Symbol not found or service unavailable"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(data)


class KlinesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, symbol):
        interval = request.query_params.get("interval", "1h")
        limit = request.query_params.get("limit", "500")
        
        try:
            limit = int(limit)
        except ValueError:
            limit = 500

        data = services.get_klines(symbol, interval, limit)
        if not data:
            return Response(
                {"error": "Could not fetch candles"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        return Response(data)
