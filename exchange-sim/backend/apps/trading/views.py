from decimal import Decimal
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.errors import InsufficientFunds, InvalidMarket, OrderNotCancelable
from .models import Order, Trade
from .serializers import OrderSerializer, TradeSerializer
from .services import create_limit_order, cancel_order
from .selectors import get_orderbook_bids, get_orderbook_asks


class OrderCreateView(APIView):
    def post(self, request):
        market_symbol = request.data.get("market_symbol") or request.data.get("symbol")
        side = request.data.get("side")
        price = request.data.get("price")
        amount = request.data.get("amount")
        if not all([market_symbol, side, price is not None, amount is not None]):
            return Response(
                {"error": "market_symbol, side, price, amount required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            price = Decimal(str(price))
            amount = Decimal(str(amount))
        except Exception:
            return Response({"error": "invalid price or amount"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = create_limit_order(request.user, market_symbol, side.upper(), price, amount)
        except InvalidMarket:
            return Response({"error": "Invalid market"}, status=status.HTTP_400_BAD_REQUEST)
        except InsufficientFunds:
            return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderCancelView(APIView):
    def post(self, request, pk):
        try:
            order = cancel_order(request.user, pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except OrderNotCancelable:
            return Response({"error": "Order cannot be canceled"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data)


class OpenOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        from common.constants import ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED
        return Order.objects.filter(
            user=self.request.user,
            status__in=(ORDER_STATUS_OPEN, ORDER_STATUS_PARTIALLY_FILLED),
        ).order_by("-created_at")


class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        limit = int(self.request.query_params.get("limit", 100))
        return Order.objects.filter(user=self.request.user).order_by("-created_at")[:limit]


class TradesListView(generics.ListAPIView):
    serializer_class = TradeSerializer

    def get_queryset(self):
        qs = Trade.objects.all().order_by("-created_at")
        symbol = self.request.query_params.get("symbol")
        if symbol:
            qs = qs.filter(market_symbol=symbol)
        return qs[: int(self.request.query_params.get("limit", 100))]


class OrderbookView(APIView):
    def get(self, request):
        symbol = request.query_params.get("symbol")
        if not symbol:
            return Response({"error": "symbol required"}, status=status.HTTP_400_BAD_REQUEST)
        limit = int(request.query_params.get("limit", 50))
        bids = get_orderbook_bids(symbol, limit=limit)
        asks = get_orderbook_asks(symbol, limit=limit)
        from django.utils import timezone
        return Response({
            "symbol": symbol,
            "bids": bids,
            "asks": asks,
            "ts": int(timezone.now().timestamp() * 1000),
        })
