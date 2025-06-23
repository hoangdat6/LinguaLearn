from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.services import StreakService


class ResetStreakAPIView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            streak = StreakService.reset_streak(user=request.user)
            if streak is None:
                return Response({"error": "Failed to reset streak."}, status=400)

            return Response({"message": "Streak reset successfully."}, status=200)
