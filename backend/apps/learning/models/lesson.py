from django.db import models
from cloudinary.models import CloudinaryField
from apps.learning.models.course import Course

class Lesson(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  # Hình ảnh bài học
    created_at = models.DateTimeField(auto_now_add=True)  # Lưu thời gian khi tạo
    updated_at = models.DateTimeField(auto_now=True)  # Lưu thời gian khi cập nhật
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        ordering = ['-created_at']

