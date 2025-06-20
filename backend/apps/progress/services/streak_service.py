from django.utils import timezone
from datetime import timedelta


class StreakService:
    @staticmethod
    def calculate_new_level_and_streak(is_review, current_level, current_streak, is_correct):
        """
        Calculate new level and streak based on learning parameters
        
        Args:
            is_review: Whether this is a review session
            current_level: Current level (1-5)
            current_streak: Current streak (1-10)
            is_correct: Whether the answer was correct
            
        Returns:
            tuple: (new_level, new_streak, score_gain)
        """
        score_gain = 0
        
        if not is_review:
            # For learning new words, reset level and streak
            score_gain = 1
            new_level = 1
            new_streak = 1
        else:
            if is_correct is False:
                # Wrong answer decreases level and resets streak
                new_streak = 1
                new_level = max(current_level - 1, 1)
            else:
                # Correct answer increases level and streak
                score_gain = current_level
                new_streak = min(10, current_streak + 1)
                new_level = min(current_level + 1, 5)
        
        return new_level, new_streak, score_gain
    
    @staticmethod
    def calculate_review_intervals(level, streak, question_type=None):
        """
        Calculate when a word should be reviewed next based on its level and streak
        
        Args:
            level: Current word level (1-5)
            streak: Current streak count (1-10)
            question_type: Type of question (can affect review interval)
            
        Returns:
            datetime: When the word should be reviewed next
        """
        # Base intervals in minutes for each level
        base_intervals = {
            1: 5,       # Level 1: 5 minutes
            2: 30,      # Level 2: 30 minutes
            3: 60 * 2,  # Level 3: 2 hours
            4: 60 * 8,  # Level 4: 8 hours
            5: 60 * 24  # Level 5: 24 hours
        }
        
        # Apply streak multiplier
        multiplier = min(streak, 5) / 2  # Max multiplier is 2.5
        interval_minutes = base_intervals.get(level, 5) * multiplier
        
        # Question type modifier (optional)
        if question_type:
            if question_type == "L3":  # More difficult question types
                interval_minutes *= 0.8  # Slightly reduce interval
            elif question_type == "L1":  # Easier question types
                interval_minutes *= 1.2  # Slightly increase interval
        
        next_review = timezone.now() + timedelta(minutes=interval_minutes)
        return next_review
