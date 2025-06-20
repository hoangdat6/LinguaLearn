from django.db import models
from django.utils.timezone import now

from apps.accounts.models import CustomUser
from apps.learning.models.word import Word


class VocabularyProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_words')
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_words')
    level = models.PositiveSmallIntegerField(default=1)
    next_review = models.DateTimeField(default=now)
    last_review = models.DateTimeField(auto_now=True)
    streak = models.PositiveIntegerField(default=1)
    learned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_userword'
        constraints = [
            models.UniqueConstraint(fields=['user', 'word'], name='unique_user_word')
        ]

    def __str__(self):
        return f"{self.user.username} - {self.word.word} (Level: {self.level})"