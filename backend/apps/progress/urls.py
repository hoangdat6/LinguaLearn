from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.progress.views.course_progress_view import CourseProgressViewSet
from apps.progress.views.lesson_progress_view import LessonProgressViewSet
from apps.progress.views.vocabulary_progress_view import VocabularyProgressViewSet

router = DefaultRouter()
router.register(r'courses', CourseProgressViewSet, basename='course')
router.register(r'lessons', LessonProgressViewSet, basename='lesson')
router.register(r'vocabularies', VocabularyProgressViewSet, basename='vocabulary')


urlpatterns = [
    path('', include(router.urls)),
]
