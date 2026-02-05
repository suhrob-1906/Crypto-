from django.contrib import admin
from django.urls import path, include
from apps.trading.views import TradesListView, OrderbookView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.users.urls")),
    path("api/markets/", include("apps.markets.urls")),
    path("api/wallet/", include("apps.wallet.urls")),
    path("api/orders/", include("apps.trading.urls")),
    path("api/trades/", TradesListView.as_view()),
    path("api/orderbook/", OrderbookView.as_view()),
    path("api/stats/", include("apps.analytics.urls")),
]
