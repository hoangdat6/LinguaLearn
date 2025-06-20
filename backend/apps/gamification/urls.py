from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.gamification.views.leader_board_views import LeaderBoardViewSet
from apps.learning.views.course_view import CourseViewSet

router = DefaultRouter()
router.register(r'leaderboard', LeaderBoardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
]
