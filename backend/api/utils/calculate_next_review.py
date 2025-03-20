from django.utils import timezone
from datetime import timedelta
from random import randint

level_time = [0.5, 2.5, 12.5, 62.5, 312.5]
question_type_times = {
    "L1": 1,
    "L2": 1.1,
    "L3": 1.2,
    "L4": 1.3,
    "L5": 1.5,
}

def calculate_next_review(level, streak, question_type):
    """
    Hàm tính toán thời gian học từ vựng tiếp theo dựa trên level, streak và question_type
    :param level: int
    :param streak: int
    :param question_type: str
    :return: datetime
    """
    time = streak * question_type_times[question_type] * level_time[level - 1] + randint(0, 5)

    next_review = timezone.now() + timedelta(hours=time)
    return next_review
   