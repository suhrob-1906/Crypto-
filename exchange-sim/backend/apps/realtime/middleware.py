from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


def get_user_from_token(token_value):
    try:
        token = AccessToken(token_value)
        return User.objects.get(id=token["user_id"])
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query = parse_qs(scope.get("query_string", b"").decode())
        token = query.get("token", [None])[0]
        if token:
            scope["user"] = await database_sync_to_async(get_user_from_token)(token)
        else:
            scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)
