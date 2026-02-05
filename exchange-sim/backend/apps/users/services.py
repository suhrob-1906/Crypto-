from django.contrib.auth import get_user_model
from decimal import Decimal

from apps.wallet.models import Balance, LedgerEntry
from common.constants import LEDGER_KIND_INITIAL

User = get_user_model()

INITIAL_USDT = Decimal("10000")


def create_user_with_initial_balance(username: str, email: str, password: str) -> User:
    user = User.objects.create_user(username=username, email=email, password=password)
    Balance.objects.create(user=user, asset_code="USDT", available=INITIAL_USDT, locked=Decimal("0"))
    LedgerEntry.objects.create(
        user=user,
        asset_code="USDT",
        delta=INITIAL_USDT,
        kind=LEDGER_KIND_INITIAL,
        meta={"initial_balance": str(INITIAL_USDT)},
    )
    return user
