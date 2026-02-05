import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


class MarketTickerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.symbol = self.scope["url_route"]["kwargs"]["symbol"]
        self.group = f"market_{self.symbol}_ticker"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))


class MarketOrderbookConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.symbol = self.scope["url_route"]["kwargs"]["symbol"]
        self.group = f"market_{self.symbol}_orderbook"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))


class MarketTradesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.symbol = self.scope["url_route"]["kwargs"]["symbol"]
        self.group = f"market_{self.symbol}_trades"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))


class UserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")
        if not self.user or self.user.is_anonymous:
            await self.close()
            return
        self.group = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group"):
            await self.channel_layer.group_discard(self.group, self.channel_name)

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))
