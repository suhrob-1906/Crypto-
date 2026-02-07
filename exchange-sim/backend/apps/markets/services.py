import logging
import requests
from django.core.cache import cache
from django.conf import settings

logger = logging.getLogger(__name__)

BINANCE_BASE = getattr(settings, "BINANCE_API_BASE", "https://api.binance.com")

# Cache keys
CACHE_KEY_EXCHANGE_INFO = "binance:exchange_info"
CACHE_KEY_TICKER_24H = "binance:ticker_24h:{symbol}"
CACHE_KEY_KLINES = "binance:klines:{symbol}:{interval}"

# Cache timeouts (seconds)
TIMEOUT_EXCHANGE_INFO = 3600 * 6  # 6 hours
TIMEOUT_TICKER_24H = 10           # 10 seconds
TIMEOUT_KLINES = 30               # 30 seconds


def get_exchange_info():
    """Returns Binance Exchange Info (symbols, filters). Cached."""
    data = cache.get(CACHE_KEY_EXCHANGE_INFO)
    if data:
        return data

    try:
        url = f"{BINANCE_BASE}/api/v3/exchangeInfo"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        cache.set(CACHE_KEY_EXCHANGE_INFO, data, TIMEOUT_EXCHANGE_INFO)
        return data
    except Exception as e:
        logger.error(f"Error fetching exchange info: {e}")
        # Return empty structure or raise depending on strictness. 
        # Returning None allows views to handle 503
        return None


def get_ticker_24h(symbol):
    """Returns 24h ticker stats (volume, high, low, lastPrice)."""
    key = CACHE_KEY_TICKER_24H.format(symbol=symbol)
    data = cache.get(key)
    if data:
        return data

    try:
        url = f"{BINANCE_BASE}/api/v3/ticker/24hr"
        response = requests.get(url, params={"symbol": symbol.upper()}, timeout=5)
        response.raise_for_status()
        data = response.json()
        cache.set(key, data, TIMEOUT_TICKER_24H)
        return data
    except Exception as e:
        logger.error(f"Error fetching ticker 24h for {symbol}: {e}")
        return None

def get_klines(symbol, interval, limit=500):
    """Returns candlestick data."""
    # We include limit in cache key if dynamic, but usually fixed for chart initial load
    key = f"{CACHE_KEY_KLINES.format(symbol=symbol, interval=interval)}:{limit}"
    data = cache.get(key)
    if data:
        return data

    try:
        url = f"{BINANCE_BASE}/api/v3/klines"
        params = {
            "symbol": symbol.upper(),
            "interval": interval,
            "limit": limit
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        cache.set(key, data, TIMEOUT_KLINES)
        return data
    except Exception as e:
        logger.error(f"Error fetching klines for {symbol}: {e}")
        return None
