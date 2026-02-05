from decimal import Decimal
from django.db import transaction
from django.db.models import Sum
from django.conf import settings

from common.errors import DailyLimitExceeded, InsufficientFunds
from common.constants import (
    LEDGER_KIND_DEPOSIT,
    LEDGER_KIND_WITHDRAW,
    CASHFLOW_TYPE_DEPOSIT,
    CASHFLOW_TYPE_WITHDRAW,
    CASHFLOW_STATUS_COMPLETED,
)
from common.time import utc_today_start
from .models import Balance, LedgerEntry, CashFlow


def add_ledger(user, asset_code: str, delta: Decimal, kind: str, meta: dict = None):
    LedgerEntry.objects.create(
        user=user,
        asset_code=asset_code,
        delta=delta,
        kind=kind,
        meta=meta or {},
    )


def _today_sum(user, flow_type: str) -> Decimal:
    start = utc_today_start()
    qs = CashFlow.objects.filter(user=user, type=flow_type, created_at__gte=start)
    r = qs.aggregate(total=Sum("amount"))
    return r["total"] or Decimal("0")


def apply_deposit(user, amount: Decimal, asset_code: str = "USDT"):
    if amount <= 0:
        raise ValueError("amount must be positive")
    daily_limit = getattr(settings, "DAILY_CASHFLOW_LIMIT", 100_000)
    today_sum = _today_sum(user, CASHFLOW_TYPE_DEPOSIT)
    if today_sum + amount > daily_limit:
        raise DailyLimitExceeded()
    with transaction.atomic():
        CashFlow.objects.create(
            user=user,
            type=CASHFLOW_TYPE_DEPOSIT,
            asset_code=asset_code,
            amount=amount,
            status=CASHFLOW_STATUS_COMPLETED,
        )
        add_ledger(user, asset_code, amount, LEDGER_KIND_DEPOSIT, {"amount": str(amount)})
        bal, _ = Balance.objects.select_for_update().get_or_create(
            user=user,
            asset_code=asset_code,
            defaults={"available": Decimal("0"), "locked": Decimal("0")},
        )
        bal.available += amount
        bal.save(update_fields=["available"])


def apply_withdraw(user, amount: Decimal, asset_code: str = "USDT"):
    if amount <= 0:
        raise ValueError("amount must be positive")
    daily_limit = getattr(settings, "DAILY_CASHFLOW_LIMIT", 100_000)
    today_sum = _today_sum(user, CASHFLOW_TYPE_WITHDRAW)
    if today_sum + amount > daily_limit:
        raise DailyLimitExceeded()
    with transaction.atomic():
        bal = Balance.objects.select_for_update().get(user=user, asset_code=asset_code)
        if bal.available < amount:
            raise InsufficientFunds()
        CashFlow.objects.create(
            user=user,
            type=CASHFLOW_TYPE_WITHDRAW,
            asset_code=asset_code,
            amount=amount,
            status=CASHFLOW_STATUS_COMPLETED,
        )
        add_ledger(user, asset_code, -amount, LEDGER_KIND_WITHDRAW, {"amount": str(amount)})
        bal.available -= amount
        bal.save(update_fields=["available"])
