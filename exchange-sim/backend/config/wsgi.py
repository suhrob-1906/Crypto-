import os
from django.core.wsgi import get_wsgi_application

import dotenv

# Load .env
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
dotenv.load_dotenv(dotenv_path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
application = get_wsgi_application()
