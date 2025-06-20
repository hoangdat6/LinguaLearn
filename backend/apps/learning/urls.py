from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.learning.views.course_view import CourseViewSet
from apps.learning.views.lesson_view import LessonViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')


urlpatterns = [
    path('', include(router.urls)),
]
