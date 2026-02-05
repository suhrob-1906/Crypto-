from django.urls import path
from .views import MarketStatsView, TopMarketsView

urlpatterns = [
    path("market/", MarketStatsView.as_view()),
    path("top/", TopMarketsView.as_view()),
]
