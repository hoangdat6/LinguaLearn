from django.db import models

from apps.accounts.models import CustomUser


# Create your models here.
class LeaderBoard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)  # Điểm số tổng hợp từ các bài học
    date_updated = models.DateTimeField(auto_now=True)  # Thời gian cập nhật điểm số

    class Meta:
        db_table = 'api_leaderboard'
        ordering = ['-total_score']

    def __str__(self):
        return f"{self.user.username} - {self.total_score}"