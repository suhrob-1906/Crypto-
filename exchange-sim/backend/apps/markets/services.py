import logging
import requests
from django.core.cache import cache
from django.conf import settings
from datetime import datetime

logger = logging.getLogger(__name__)

BINANCE_BASE = getattr(settings, "BINANCE_API_BASE", "https://api.binance.com")
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Coin mapping for CoinGecko
COIN_MAP = {
    'BTCUSDT': 'bitcoin',
    'ETHUSDT': 'ethereum',
    'BNBUSDT': 'binancecoin',
    'SOLUSDT': 'solana',
    'XRPUSDT': 'ripple',
    'ADAUSDT': 'cardano',
}

# Cache keys
CACHE_KEY_EXCHANGE_INFO = "binance:exchange_info"
CACHE_KEY_TICKER_24H = "binance:ticker_24h:{symbol}"
CACHE_KEY_KLINES = "binance:klines:{symbol}:{interval}"
CACHE_KEY_COINGECKO = "coingecko:chart:{symbol}:{days}"

# Cache timeouts (seconds)
TIMEOUT_EXCHANGE_INFO = 3600 * 6  # 6 hours
TIMEOUT_TICKER_24H = 10           # 10 seconds
TIMEOUT_KLINES = 30               # 30 seconds
TIMEOUT_COINGECKO = 300           # 5 minutes


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


def convert_coingecko_to_binance_format(coingecko_data):
    """Convert CoinGecko market_chart data to Binance klines format"""
    if not coingecko_data or 'prices' not in coingecko_data:
        return []
    
    prices = coingecko_data['prices']
    volumes = coingecko_data.get('total_volumes', [])
    
    # Group by hour and create OHLC candles
    candles = []
    for i in range(0, len(prices) - 1):
        timestamp = int(prices[i][0])
        price = prices[i][1]
        next_price = prices[i + 1][1] if i + 1 < len(prices) else price
        volume = volumes[i][1] if i < len(volumes) else 0
        
        # Binance kline format: [timestamp, open, high, low, close, volume, closeTime, ...]
        candle = [
            timestamp,
            str(price),  # open
            str(max(price, next_price)),  # high
            str(min(price, next_price)),  # low
            str(next_price),  # close
            str(volume),
            timestamp + 3600000,  # closeTime (1 hour later)
            "0", "0", "0", "0", "0"  # unused fields
        ]
        candles.append(candle)
    
    return candles


def get_klines_coingecko(symbol, days=7):
    """Fetch chart data from CoinGecko (no region restrictions)"""
    cache_key = CACHE_KEY_COINGECKO.format(symbol=symbol, days=days)
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    try:
        coin_id = COIN_MAP.get(symbol, 'bitcoin')
        url = f"{COINGECKO_BASE}/coins/{coin_id}/market_chart"
        params = {
            "vs_currency": "usd",
            "days": days,
            "interval": "hourly"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Convert to Binance format
        binance_format = convert_coingecko_to_binance_format(data)
        cache.set(cache_key, binance_format, TIMEOUT_COINGECKO)
        
        logger.info(f"Successfully fetched {len(binance_format)} candles from CoinGecko for {symbol}")
        return binance_format
        
    except Exception as e:
        logger.error(f"Error fetching CoinGecko data for {symbol}: {e}")
        return None


def get_klines(symbol, interval, limit=500):
    """Returns candlestick data. Falls back to CoinGecko if Binance fails."""
    key = f"{CACHE_KEY_KLINES.format(symbol=symbol, interval=interval)}:{limit}"
    data = cache.get(key)
    if data:
        return data

    # Try Binance first
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
        logger.info(f"Successfully fetched {len(data)} candles from Binance for {symbol}")
        return data
    except Exception as e:
        logger.warning(f"Binance API failed for {symbol}: {e}. Falling back to CoinGecko...")
        
        # Fallback to CoinGecko
        coingecko_data = get_klines_coingecko(symbol, days=7)
        if coingecko_data:
            # Limit to requested amount
            limited_data = coingecko_data[-limit:] if len(coingecko_data) > limit else coingecko_data
            cache.set(key, limited_data, TIMEOUT_KLINES)
            return limited_data
        
        logger.error(f"Both Binance and CoinGecko failed for {symbol}")
        return None
