from django.db.models import Min
from django.utils import timezone
from datetime import timedelta
from apps.progress.models import VocabularyProgress

def get_review_ready_words(user):
    """
    Trả về tuple (cutoff_time, queryset) với:
      - cutoff_time = max(min(next_review) + 180 phút, now)
      - queryset các từ của user có next_review <= cutoff_time
    """
    now = timezone.now()
    result = VocabularyProgress.objects.filter(user=user).aggregate(min_next=Min('next_review'))
    min_next_review = result.get('min_next')
    if min_next_review is None:
        # Trong trường hợp không có từ nào, cutoff_time có thể là now
        cutoff_time = now
        return cutoff_time, VocabularyProgress.objects.none()
    cutoff_time = max(min_next_review + timedelta(minutes=180), now)
    return cutoff_time, VocabularyProgress.objects.filter(user=user, next_review__lte=cutoff_time)