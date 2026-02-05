from decimal import Decimal, ROUND_DOWN

FEE_RATE = Decimal("0.001")


def quantize_btc(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.00000001"), rounding=ROUND_DOWN)


def quantize_usdt(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.000001"), rounding=ROUND_DOWN)


def compute_fee(cost: Decimal) -> Decimal:
    return (cost * FEE_RATE).quantize(Decimal("0.000001"), rounding=ROUND_DOWN)
