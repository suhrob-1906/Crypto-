from django.urls import path
from .views import MarketListView, TickerView, CandlesView

urlpatterns = [
    path("", MarketListView.as_view()),
    path("<str:symbol>/ticker/", TickerView.as_view()),
    path("<str:symbol>/candles/", CandlesView.as_view()),
]
