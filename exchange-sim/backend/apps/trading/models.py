from decimal import Decimal
from django.db import models
from django.conf import settings


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    market_symbol = models.CharField(max_length=20)
    side = models.CharField(max_length=4)
    type = models.CharField(max_length=10, default="LIMIT")
    price = models.DecimalField(max_digits=28, decimal_places=8)
    amount = models.DecimalField(max_digits=28, decimal_places=8)
    filled_amount = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["market_symbol", "side", "status", "price", "created_at"]),
        ]
        ordering = ["-created_at"]


class Trade(models.Model):
    market_symbol = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=28, decimal_places=8)
    amount = models.DecimalField(max_digits=28, decimal_places=8)
    buy_order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="trades_as_buyer")
    sell_order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="trades_as_seller")
    taker_side = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["market_symbol", "created_at"])]
        ordering = ["-created_at"]
