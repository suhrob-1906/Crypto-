from decimal import Decimal
from django.db import models


class MarketStats(models.Model):
    market_symbol = models.CharField(max_length=20, unique=True)
    last_price = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    volume_24h_quote = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    high_24h = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    low_24h = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    trades_24h = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
