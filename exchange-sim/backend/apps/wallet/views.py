from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Balance, LedgerEntry, CashFlow
from .serializers import BalanceSerializer, LedgerEntrySerializer, CashFlowSerializer
from .services import apply_deposit, apply_withdraw
from common.errors import DailyLimitExceeded, InsufficientFunds


class WalletView(APIView):
    def get(self, request):
        balances = Balance.objects.filter(user=request.user)
        return Response(BalanceSerializer(balances, many=True).data)


class DepositView(APIView):
    def post(self, request):
        amount_str = request.data.get("amount")
        if not amount_str:
            return Response({"error": "amount required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from decimal import Decimal
            amount = Decimal(str(amount_str))
        except Exception:
            return Response({"error": "invalid amount"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            apply_deposit(request.user, amount)
        except DailyLimitExceeded:
            return Response({"error": "Daily limit exceeded"}, status=status.HTTP_400_BAD_REQUEST)
        balances = Balance.objects.filter(user=request.user)
        return Response(BalanceSerializer(balances, many=True).data)


class WithdrawView(APIView):
    def post(self, request):
        amount_str = request.data.get("amount")
        if not amount_str:
            return Response({"error": "amount required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from decimal import Decimal
            amount = Decimal(str(amount_str))
        except Exception:
            return Response({"error": "invalid amount"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            apply_withdraw(request.user, amount)
        except DailyLimitExceeded:
            return Response({"error": "Daily limit exceeded"}, status=status.HTTP_400_BAD_REQUEST)
        except InsufficientFunds:
            return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)
        balances = Balance.objects.filter(user=request.user)
        return Response(BalanceSerializer(balances, many=True).data)


class LedgerView(generics.ListAPIView):
    serializer_class = LedgerEntrySerializer

    def get_queryset(self):
        return LedgerEntry.objects.filter(user=self.request.user)[: int(self.request.query_params.get("limit", 100))]


class CashFlowsView(generics.ListAPIView):
    serializer_class = CashFlowSerializer

    def get_queryset(self):
        return CashFlow.objects.filter(user=self.request.user)[: int(self.request.query_params.get("limit", 100))]
