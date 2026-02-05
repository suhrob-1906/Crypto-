from rest_framework import serializers
from .models import Order, Trade


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "market_symbol",
            "side",
            "type",
            "price",
            "amount",
            "filled_amount",
            "status",
            "created_at",
        )


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = (
            "id",
            "market_symbol",
            "price",
            "amount",
            "buy_order",
            "sell_order",
            "taker_side",
            "created_at",
        )
