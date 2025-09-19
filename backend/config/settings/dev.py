from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", os.getenv("ALLOWED_HOSTS")]

CORS_ALLOWED_ORIGINS = [
    os.getenv("CORS_ALLOWED_ORIGIN"),
    "http://localhost:3000",
    "http://localhost:3001",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
        'OPTIONS': {
            'sslmode': os.getenv("SSLMODE", "prefer"),
        },
    }
}
