import { useEffect, useRef, useState } from 'react';

const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

/**
 * Manages WebSocket connection to Binance for a specific symbol.
 * Subscribes to: miniTicker, depth20, aggTrade.
 */
class BinanceStream {
    constructor(symbol, onMessage) {
        this.symbol = symbol.toLowerCase();
        this.onMessage = onMessage;
        this.ws = null;
        this.pingInterval = null;
        this.reconnectTimeout = null;
        this.isClosed = false;
    }

    connect() {
        if (this.isClosed) return;

        // Streams: <symbol>@miniTicker / <symbol>@depth20@100ms / <symbol>@aggTrade
        const streams = [
            `${this.symbol}@miniTicker`,
            `${this.symbol}@depth20@100ms`,
            `${this.symbol}@aggTrade`
        ].join('/');

        this.ws = new WebSocket(`${BINANCE_WS_BASE}/${streams}`);

        this.ws.onopen = () => {
            console.log(`[Binance WS] Connected to ${this.symbol}`);
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessage(data);
            } catch (err) {
                console.error('[Binance WS] Parse error:', err);
            }
        };

        this.ws.onclose = () => {
            this.stopHeartbeat();
            if (!this.isClosed) {
                console.log('[Binance WS] Disconnected. Reconnecting in 3s...');
                this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[Binance WS] Error:', err);
            this.ws.close();
        };
    }

    disconnect() {
        this.isClosed = true;
        this.stopHeartbeat();
        clearTimeout(this.reconnectTimeout);
        if (this.ws) {
            this.ws.close();
        }
    }

    startHeartbeat() {
        // Binance WS automatically closes if no activity, but we are subscribing to active streams.
        // However, sending a pong or keepalive isn't strictly necessary for public streams if receiving data.
        // We'll just rely on reconnection logic for now.
    }

    stopHeartbeat() {
        if (this.pingInterval) clearInterval(this.pingInterval);
    }
}

export default BinanceStream;
