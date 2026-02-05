from rest_framework import serializers
from .models import Balance, LedgerEntry, CashFlow


class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = ("asset_code", "available", "locked")


class LedgerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerEntry
        fields = ("id", "asset_code", "delta", "kind", "meta", "created_at")


class CashFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashFlow
        fields = ("id", "type", "asset_code", "amount", "status", "created_at")
