from django.utils import timezone


def utc_today_start():
    now = timezone.now()
    return now.replace(hour=0, minute=0, second=0, microsecond=0)
