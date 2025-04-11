from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts.views import GoogleAuthView
from accounts.views import FacebookAuthView
from accounts.views.auth_view import AuthViewSet

router = DefaultRouter()

router.register(r'', AuthViewSet, basename='user')

urlpatterns = [
    path("", include(router.urls)),
    path("google/login/", GoogleAuthView.as_view()),
    path("facebook/login/", FacebookAuthView.as_view()),  # Chưa có
]
