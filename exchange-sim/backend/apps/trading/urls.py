from django.urls import path
from .views import (
    OrderCreateView,
    OrderCancelView,
    OpenOrdersView,
    OrderHistoryView,
)

urlpatterns = [
    path("", OrderCreateView.as_view()),
    path("<int:pk>/cancel/", OrderCancelView.as_view()),
    path("open/", OpenOrdersView.as_view()),
    path("history/", OrderHistoryView.as_view()),
]
