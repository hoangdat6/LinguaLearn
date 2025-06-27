from django.db import models

class EnglishWord(models.Model):
    word = models.CharField(max_length=100, unique=True)  # Từ tiếng Anh
    meaning = models.TextField(blank=True)  # Nghĩa của từ
    example = models.TextField(blank=True)  # Ví dụ sử dụng từ
    created_at = models.DateTimeField(auto_now_add=True)  # Ngày tạo

    def __str__(self):
        return self.word
