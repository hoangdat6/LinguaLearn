from datetime import timedelta

from django.utils import timezone

from apps.accounts.models import UserDetail


class StreakService:
    """
    Service for managing streaks.
    """

    @staticmethod
    def get_streak(user):
        """
        Get the current streak for a user.
        """
        return user.streak

    @staticmethod
    def reset_streak(user):
        """
        Reset the user's streak to 0.
        """
        today = timezone.now().date()
        user_detail = UserDetail.objects.get(user=user)
        if user_detail.last_activity_date and user_detail.last_activity_date < today - timedelta(days=1):
            user_detail.streak = 0
            user_detail.last_activity_date = today
            user_detail.save()

        return user_detail.streak

    @staticmethod
    def update_streak(user):
        """
        Update the user's streak based on their last activity.
        """
        user_detail = UserDetail.objects.get(user=user)
        today = timezone.now().date()

        # nếu ngày hoạt động cuối cùng là hôm nay thì không cần cập nhật streak
        if user_detail.last_activity_date and user_detail.last_activity_date == today:
            return user_detail.streak

        if user_detail.last_activity_date is None:
            user_detail.streak = 1
        elif user_detail.last_activity_date == today - timedelta(days=1):
            user_detail.streak += 1
        elif user_detail.last_activity_date < today - timedelta(days=1):
            user_detail.streak = 1

        user_detail.last_activity_date = today
        user_detail.save()

        return user_detail.streak
