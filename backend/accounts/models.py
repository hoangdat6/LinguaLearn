import uuid

from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
    avatar = models.URLField(max_length=255, null=True, blank=True)

    # for social login
    is_social = models.BooleanField(default=False)
    provider = models.CharField(max_length=50, null=True, blank=True)  # 'google', 'facebook', etc.
    social_uid = models.CharField(max_length=255, null=True, blank=True, unique=True)  # id của Google user
