import requests
from django.conf import settings

BINANCE_BASE = getattr(settings, "BINANCE_API_BASE", "https://api.binance.com")


def fetch_binance_ticker(symbol: str) -> dict:
    r = requests.get(f"{BINANCE_BASE}/api/v3/ticker/price", params={"symbol": symbol}, timeout=10)
    r.raise_for_status()
    return r.json()


def fetch_binance_klines(symbol: str, interval: str, limit: int = 365) -> list:
    r = requests.get(
        f"{BINANCE_BASE}/api/v3/klines",
        params={"symbol": symbol, "interval": interval, "limit": limit},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()
