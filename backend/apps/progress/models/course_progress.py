from django.db import models
from apps.learning.models.course import Course
from apps.accounts.models import CustomUser


class CourseProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'api_usercourse'
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='unique_user_course')
        ]
        ordering = ['-date_started']  # Ví dụ: sắp xếp theo ngày bắt đầu giảm dần

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"





