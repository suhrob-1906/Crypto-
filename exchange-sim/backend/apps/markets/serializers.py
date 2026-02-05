from rest_framework import serializers
from .models import Asset, Market


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ("code", "name", "precision")


class MarketSerializer(serializers.ModelSerializer):
    base_asset = AssetSerializer(read_only=True)
    quote_asset = AssetSerializer(read_only=True)

    class Meta:
        model = Market
        fields = ("symbol", "base_asset", "quote_asset", "is_active")
