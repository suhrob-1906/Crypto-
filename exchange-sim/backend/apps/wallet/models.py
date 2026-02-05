from decimal import Decimal
from django.db import models
from django.conf import settings


class Balance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="balances")
    asset_code = models.CharField(max_length=20)
    available = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))
    locked = models.DecimalField(max_digits=28, decimal_places=8, default=Decimal("0"))

    class Meta:
        unique_together = [("user", "asset_code")]
        indexes = [models.Index(fields=["user"])]


class LedgerEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ledger_entries")
    asset_code = models.CharField(max_length=20)
    delta = models.DecimalField(max_digits=28, decimal_places=8)
    kind = models.CharField(max_length=20)
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user", "created_at"])]
        ordering = ["-created_at"]


class CashFlow(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cashflows")
    type = models.CharField(max_length=20)
    asset_code = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=28, decimal_places=8)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user", "type", "created_at"])]
        ordering = ["-created_at"]
