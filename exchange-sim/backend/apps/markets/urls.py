from django.urls import path
from . import views

urlpatterns = [
    path("exchange-info/", views.ExchangeInfoView.as_view(), name="exchange-info"),
    path("<str:symbol>/stats24h/", views.Ticker24hView.as_view(), name="stats-24h"),
    path("<str:symbol>/candles/", views.KlinesView.as_view(), name="candles"),
]
