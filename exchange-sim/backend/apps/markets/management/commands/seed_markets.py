from django.core.management.base import BaseCommand
from apps.markets.models import Asset, Market


class Command(BaseCommand):
    help = "Create Asset (BTC, USDT) and Market (BTCUSDT)"

    def handle(self, *args, **options):
        btc, _ = Asset.objects.get_or_create(code="BTC", defaults={"name": "Bitcoin", "precision": 8})
        usdt, _ = Asset.objects.get_or_create(code="USDT", defaults={"name": "Tether", "precision": 6})
        Market.objects.get_or_create(
            symbol="BTCUSDT",
            defaults={"base_asset": btc, "quote_asset": usdt, "is_active": True},
        )
        self.stdout.write(self.style.SUCCESS("Seeded BTC, USDT, BTCUSDT"))
