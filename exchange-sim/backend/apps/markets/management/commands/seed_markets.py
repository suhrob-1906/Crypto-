from django.core.management.base import BaseCommand
from apps.markets.models import Asset, Market


class Command(BaseCommand):
    help = "Create popular crypto assets and markets"

    def handle(self, *args, **options):
        # Create assets
        btc, _ = Asset.objects.get_or_create(code="BTC", defaults={"name": "Bitcoin", "precision": 8})
        eth, _ = Asset.objects.get_or_create(code="ETH", defaults={"name": "Ethereum", "precision": 8})
        bnb, _ = Asset.objects.get_or_create(code="BNB", defaults={"name": "Binance Coin", "precision": 8})
        sol, _ = Asset.objects.get_or_create(code="SOL", defaults={"name": "Solana", "precision": 8})
        xrp, _ = Asset.objects.get_or_create(code="XRP", defaults={"name": "Ripple", "precision": 6})
        usdt, _ = Asset.objects.get_or_create(code="USDT", defaults={"name": "Tether", "precision": 6})
        
        # Create markets
        markets = [
            ("BTCUSDT", btc, usdt),
            ("ETHUSDT", eth, usdt),
            ("BNBUSDT", bnb, usdt),
            ("SOLUSDT", sol, usdt),
            ("XRPUSDT", xrp, usdt),
        ]
        
        for symbol, base, quote in markets:
            Market.objects.get_or_create(
                symbol=symbol,
                defaults={"base_asset": base, "quote_asset": quote, "is_active": True},
            )
        
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(markets)} markets"))
