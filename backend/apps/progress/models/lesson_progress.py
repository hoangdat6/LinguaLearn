from django.db import models

from apps.accounts.models import CustomUser
from apps.learning.models.lesson import Lesson


class LessonProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'api_userlesson'
        constraints = [
            models.UniqueConstraint(fields=['user', 'lesson'], name='unique_user_lesson')
        ]
        ordering = ['-date_started']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

