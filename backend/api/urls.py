from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, CourseViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'courses', CourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
