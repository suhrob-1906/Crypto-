from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/market/<str:symbol>/ticker/", consumers.MarketTickerConsumer.as_asgi()),
    path("ws/market/<str:symbol>/orderbook/", consumers.MarketOrderbookConsumer.as_asgi()),
    path("ws/market/<str:symbol>/trades/", consumers.MarketTradesConsumer.as_asgi()),
    path("ws/user/me/", consumers.UserConsumer.as_asgi()),
]
