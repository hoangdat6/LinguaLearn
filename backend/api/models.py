from django.db import models
import cloudinary
from cloudinary.models import CloudinaryField
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
import uuid
class Course(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    en_title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)  
    icon = models.CharField(max_length=10, blank=True, null=True)
    def __str__(self):
        return self.title

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


class Word(models.Model):
    id = models.AutoField(primary_key=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    word = models.CharField(max_length=255)
    pronunciation = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField()
    example = models.TextField(blank=True, null=True)
    example_vi = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  # Hình ảnh từ vựng
    audio = CloudinaryField('audio', blank=True, null=True)  # Âm thanh từ vựng
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.word
    

class CustomUser (AbstractUser):
    email_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
