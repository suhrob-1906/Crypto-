from django.urls import path
from .views import WalletView, DepositView, WithdrawView, LedgerView, CashFlowsView

urlpatterns = [
    path("", WalletView.as_view()),
    path("deposit/", DepositView.as_view()),
    path("withdraw/", WithdrawView.as_view()),
    path("ledger/", LedgerView.as_view()),
    path("cashflows/", CashFlowsView.as_view()),
]
