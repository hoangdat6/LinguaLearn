from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, CourseViewSet, UserViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
