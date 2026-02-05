from django.db import models


class Asset(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    precision = models.PositiveSmallIntegerField(default=8)


class Market(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    base_asset = models.ForeignKey(Asset, on_delete=models.PROTECT, related_name="base_markets")
    quote_asset = models.ForeignKey(Asset, on_delete=models.PROTECT, related_name="quote_markets")
    is_active = models.BooleanField(default=True)
