from django.db import models
from cloudinary.models import CloudinaryField

# Create your models here.
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

    class Meta:
        db_table = 'courses'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['-created_at']
