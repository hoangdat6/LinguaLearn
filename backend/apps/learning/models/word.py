from cloudinary.models import CloudinaryField
from django.db import models
from django.utils.timezone import now

from apps.learning.models.lesson import Lesson


class Word(models.Model):
    id = models.AutoField(primary_key=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    word = models.CharField(max_length=255)
    pronunciation = models.CharField(max_length=255, blank=True, null=True)
    pos = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField()
    example = models.TextField(blank=True, null=True)
    example_vi = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  # Hình ảnh từ vựng
    audio = CloudinaryField('audio', blank=True, null=True)  # Âm thanh từ vựng
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(default=now)
    cefr = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.word

    class Meta:
        db_table = 'words'
        verbose_name = 'Word'
        verbose_name_plural = 'Words'
        ordering = ['-created_at']
        unique_together = ('lesson', 'word')