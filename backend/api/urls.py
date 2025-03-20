from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, CourseViewSet, UserViewSet, UserCourseViewSet, UserLessonViewSet, UserWordViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'users', UserViewSet, basename='user')
router.register(r'user-courses', UserCourseViewSet, basename='user-course')
router.register(r'user-lessons', UserLessonViewSet, basename='user-lesson') 
router.register(r'user-words', UserWordViewSet, basename='user-word')

urlpatterns = [
    path('', include(router.urls)),
]
