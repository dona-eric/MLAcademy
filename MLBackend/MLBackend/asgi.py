"""
ASGI config for MLBackend project.

It exposes the ASGI callable as a module-level variable named ""application"".

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MLBackend.settings')

# Initialize Django ASGI application early to ensure AppRegistry is populated
# before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from community.middleware import JWTAuthMiddlewareStack
import community.routing
import notifications.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            community.routing.websocket_urlpatterns +
            notifications.routing.websocket_urlpatterns
        )
    ),
})
