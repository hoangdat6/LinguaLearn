from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.accounts.views import (
    AuthViewSet,
    UserDetailViewSet,
    FacebookAuthView,
    GoogleAuthView
)
from apps.accounts.views import ResetStreakAPIView

router = DefaultRouter()
router.register(r'', AuthViewSet, basename='user')
router.register(r'user-detail', UserDetailViewSet, basename='user-detail')

urlpatterns = [
    path("", include(router.urls)),
    path("google/login/", GoogleAuthView.as_view()),
    path("facebook/login/", FacebookAuthView.as_view()),
    path('update-streak/', ResetStreakAPIView.as_view(), name='update-streak'),

]
