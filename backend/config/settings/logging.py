import os
import sys
from .base import *

# LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
#
# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#
#     "formatters": {
#         "standard": {
#             "format": "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
#         },
#         "simple": {
#             "format": "[%(levelname)s] %(message)s"
#         },
#     },
#
#     "handlers": {
#         "console": {
#             "level": LOG_LEVEL,
#             "class": "logging.StreamHandler",
#             "stream": sys.stdout,
#             "formatter": "standard"
#         },
#         "file": {
#             "level": LOG_LEVEL,
#             "class": "logging.FileHandler",
#             "filename": os.path.join(BASE_DIR, "logs", "django.log"),
#             "formatter": "standard",
#         },
#     },
#
#     "loggers": {
#         "django": {
#             "handlers": ["console", "file"],
#             "level": LOG_LEVEL,
#             "propagate": False,
#         },
#         "django.request": {
#             "handlers": ["console", "file"],
#             "level": LOG_LEVEL,
#             "propagate": False,
#         },
#         "config": {
#             "handlers": ["console", "file"],
#             "level": LOG_LEVEL,
#             "propagate": False,
#         },
#
#     },
#
#     "root": {
#         "handlers": ["console", "file"],
#         "level": LOG_LEVEL,
#     }
# }
