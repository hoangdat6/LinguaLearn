from datetime import timedelta

from django.core.cache import cache
from django.db.models import Count, Case, When, IntegerField
from django.utils import timezone

from apps.gamification.models import LeaderBoard
from ..models import VocabularyProgress, LessonProgress, CourseProgress
from ..serializers import (
    VocabularyProgressOutputSerializer, LessonWordsInputSerializer, LearnedWordsSerializer
)
from ..utils.calculate_next_review import calculate_next_review, calculate_time_until_next_review
from ..utils.get_review_ready_words import get_review_ready_words
from ...accounts.models import UserDetail


class VocabularyProgressService:
    @staticmethod
    def validate_words_data(data):
        parent_serializer = LessonWordsInputSerializer(data=data)
        parent_serializer.is_valid(raise_exception=True)
        return parent_serializer.validated_data

    @staticmethod
    def submit_words(user, data, request=None):
        validated_data = VocabularyProgressService.validate_words_data(data)
        
        is_review = validated_data['is_review']
        lesson_id = validated_data.get('lesson_id', None)
        words_data = validated_data['words']

        processed_words, score = VocabularyProgressService.process_words(user, is_review, words_data)
        
        # Update lesson progress if not reviewing
        if not is_review and lesson_id is not None:
            VocabularyProgressService.update_lesson_progress(user, lesson_id, score)

        # Prepare response data
        output_serializer = VocabularyProgressOutputSerializer(processed_words, many=True, context={'request': request})
        response_data = {
            "is_review": is_review,
            "lesson_id": lesson_id,
            "words": output_serializer.data,
        }

        # Update streak for user
        VocabularyProgressService.update_streak_for_user(user)

        # Clear relevant caches
        VocabularyProgressService.clear_user_caches(user, is_review)
        
        return response_data
    
    @staticmethod
    def process_words(user, is_review, words_data):
        processed_words = []
        update_list = []
        score = 0
        
        for word_data in words_data:
            word_id = word_data['word_id']
            question_type = word_data['question_type']
            is_correct = word_data.get('is_correct', None)
            
            # Calculate new level and streak
            if not is_review:
                # nếu là lần đầu tiên học từ này
                # thì mặc định level = 1, streak = 1
                score += 1
                new_level = 1
                new_streak = 1
            else:
                # nếu là lần review từ này
                # thì lấy thông tin từ VocabularyProgress
                level = word_data['level']
                streak = word_data['streak']

                # nếu người học trả lời sai thì giảm level và streak về 1
                if is_correct is False:
                    new_streak = 1
                    new_level = max(level - 1, 1)
                else:
                    # nếu người học trả lời đúng thì tăng level và streak
                    score += level
                    new_streak = min(10, streak + 1)
                    new_level = min(level + 1, 5)

            # tính toán lần review tiếp theo
            next_review_value = calculate_next_review(new_level, new_streak, question_type)
            
            # cập nhật hoặc tạo mới VocabularyProgress
            user_word, created = VocabularyProgress.objects.get_or_create(
                user=user,
                word_id=word_id,
                defaults={
                    'level': new_level,
                    'streak': new_streak,
                    'next_review': next_review_value,
                }
            )

            # nếu không phải là lần đầu tiên tạo VocabularyProgress
            # thì cập nhật các trường level, streak, next_review
            if not created:
                user_word.level = new_level
                user_word.streak = new_streak
                user_word.next_review = next_review_value
                update_list.append(user_word)

            processed_words.append(user_word)
        
        # thực hiện bulk update nếu có từ cần cập nhật
        if update_list:
            VocabularyProgress.objects.bulk_update(update_list, ['level', 'streak', 'next_review'])
            
        return processed_words, score
    
    @staticmethod
    def update_lesson_progress(user, lesson_id, score):
        '''
        Update the lesson progress for the user after submitting words.
        '''

        user_lesson, created_lesson = LessonProgress.objects.get_or_create(
            user=user,
            lesson_id=lesson_id,
            defaults={
                'date_started': timezone.now(),
                'date_completed': timezone.now(),
            }
        )
        
        # Update leaderboard
        VocabularyProgressService.update_leaderboard(user, score)
        
        if not created_lesson:
            user_lesson.date_completed = timezone.now()
            user_lesson.save()
        
        # Create course progress if needed
        CourseProgress.objects.get_or_create(
            user=user,
            course=user_lesson.lesson.course,
        )
    
    @staticmethod
    def update_leaderboard(user, score):
        if LeaderBoard.objects.filter(user=user).exists():
            leaderboard = LeaderBoard.objects.get(user=user)
            leaderboard.total_score += score
            leaderboard.save()
        else:
            LeaderBoard.objects.create(user=user, total_score=score)
    
    @staticmethod
    def clear_user_caches(user, is_review):
        if not is_review:
            pattern = f"usercourses:{user.id}:*"
            # Delete cache for all user courses
            cache.delete_pattern(pattern) if hasattr(cache, 'delete_pattern') else cache.delete_many(
                cache.keys(pattern))
        
        cache.delete(f"count_words_by_level_{user.id}")
        cache.delete(f"learned_words_{user.id}")
    
    @staticmethod
    def get_user_words(user):
        return VocabularyProgress.objects.filter(user=user).select_related('word')
    
    @staticmethod
    def count_words_by_level(user):
        cache_key = f"count_words_by_level_{user.id}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            cached_data['time_until_next_review'] = calculate_time_until_next_review(cached_data['cutoff_time'])
            return cached_data
        
        queryset = VocabularyProgressService.get_user_words(user)
        cutoff_time, due_words = get_review_ready_words(user)
        
        time_until_next_review = calculate_time_until_next_review(cutoff_time)
        level_counts = queryset.values('level').annotate(count=Count('id'))
        
        cefr_group_counts = queryset.aggregate(
            basic=Count(
                Case(When(word__cefr__in=["A1", "A2"], then=1), output_field=IntegerField())
            ),
            intermediate=Count(
                Case(When(word__cefr__in=["B1", "B2"], then=1), output_field=IntegerField())
            ),
            advanced=Count(
                Case(When(word__cefr__in=["C1", "C2"], then=1), output_field=IntegerField())
            )
        )
        
        result = {
            "level_counts": {f"count_level{item['level']}": item['count'] for item in level_counts},
            "cefr_group_counts": cefr_group_counts,
            "time_until_next_review": time_until_next_review,
            "review_word_count": due_words.count(),
            "cutoff_time": cutoff_time,
        }
        
        cache.set(cache_key, result, timeout=60 * 15)
        return result
    
    @staticmethod
    def get_learned_words(user, request=None):
        cache_key = f"learned_words_{user.id}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            cached_data['time_until_next_review'] = calculate_time_until_next_review(cached_data['cutoff_time'])
            return cached_data
        
        queryset = VocabularyProgressService.get_user_words(user)
        cutoff_time, due_words = get_review_ready_words(user)
        time_until_next_review = calculate_time_until_next_review(cutoff_time)
        
        level_counts_qs = queryset.values('level').annotate(count=Count('id'))
        level_counts = {f"count_level{item['level']}": item['count'] for item in level_counts_qs}
        
        result = {
            "time_until_next_review": time_until_next_review,
            "review_word_count": due_words.count(),
            "level_counts": level_counts,
            "cutoff_time": cutoff_time,
        }
        
        for level in range(1, 6):
            level_qs = queryset.filter(level=level).order_by('id')
            words = level_qs[:10]
            serializer = LearnedWordsSerializer(words, many=True, context={'request': request})
            result[f"words_level{level}"] = serializer.data
        
        cache.set(cache_key, result, timeout=60 * 15)
        return result
    
    @staticmethod
    def get_review_words(user, request=None):
        cutoff_time, due_words = get_review_ready_words(user)
        
        if cutoff_time > timezone.now():
            return {"message": "No words to review"}
        
        serializer = VocabularyProgressOutputSerializer(due_words, many=True, context={'request': request})
        return {"words": serializer.data}
    
    @staticmethod
    def get_learned_words_pagination(user, level, paginator, request):
        queryset = VocabularyProgressService.get_user_words(user)
        
        if level is not None:
            queryset = queryset.filter(level=level)
            
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = LearnedWordsSerializer(paginated_queryset, many=True, context={'request': request})
        return serializer.data

    @staticmethod
    def update_streak_for_user(user):
        """
        Cập nhật streak khi người dùng review hoặc học bài mới.
        """

        user_detail = UserDetail.objects.get(user=user)

        if user_detail.last_activity_date is None:
            # If the user has no recorded activity date, reset the streak
            user_detail.streak = 1
        elif user_detail.last_activity_date == timezone.now().date() - timedelta(days=1):
            # User was active yesterday
            user_detail.streak += 1
        elif user_detail.last_activity_date < timezone.now().date() - timedelta(days=1):
            # User was inactive for more than a day
            user_detail.streak = 1
        else:
            # User is already active today
            user_detail.streak = user_detail.streak

        user_detail.last_activity_date = timezone.now().date()
        user_detail.save()

        return user_detail.streak



