from decimal import Decimal
from common.money import compute_fee

FEE_RATE = Decimal("0.001")


def compute_order_fee(cost: Decimal) -> Decimal:
    return compute_fee(cost)
