from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from ..models import UserWord, UserLesson
from ..pagination import LearnedWordsPagination
from ..serializers import (
    UserWordInputSerializer, UserWordOutputSerializer, LessonWordsInputSerializer
)
from ..serializers.user_progress import LearnedWordsSerializer
from ..utils.calculate_next_review import calculate_next_review
from ..utils.get_review_ready_words import get_review_ready_words

@permission_classes([IsAuthenticated])
class UserWordViewSet(viewsets.ModelViewSet):
    queryset = UserWord.objects.all()
    serializer_class = UserWordOutputSerializer

    def get_queryset(self):
        # Chỉ lấy dữ liệu của user hiện tại và lấy luôn thông tin của word
        return UserWord.objects.filter(user=self.request.user).select_related('word')

    @action(detail=False, methods=['post'], url_path='submit-lesson-words')
    def submit_lesson_words(self, request):
        """
        Input:
        {
            "is_review": true,
            "lesson_id": 12,          // Bắt buộc khi is_review là false
            "words": [
                {
                    "word_id": 123,
                    "level": 2,
                    "streak": 3,
                    "is_correct": true,
                    "question_type": "L2"
                },
                {
                    "word_id": 124,
                    "level": 3,
                    "streak": 2,
                    "is_correct": false,
                    "question_type": "L1"
                }
            ]
        }
        """
        parent_serializer = LessonWordsInputSerializer(data=request.data)
        parent_serializer.is_valid(raise_exception=True)
        validated_data = parent_serializer.validated_data

        is_review = validated_data['is_review']
        lesson_id = validated_data.get('lesson_id', None)
        words_data = validated_data['words']
        user = request.user

        processed_words = []
        update_list = []
        for word_data in words_data:
            word_id = word_data['word_id']
            level = word_data['level']
            streak = word_data['streak']
            question_type = word_data['question_type']
            is_correct = word_data.get('is_correct', None)

            if not is_review:
                # Nếu không phải ôn, reset level và streak
                new_level = 1
                new_streak = 1
            else:
                if is_correct is False:
                    new_streak = 1
                    new_level = max(level - 1, 1)
                else:
                    new_streak = min(10, streak + 1)
                    new_level = min(level + 1, 5)

            next_review_value = calculate_next_review(new_level, new_streak, question_type)

            # Tìm hoặc tạo đối tượng UserWord
            user_word, created = UserWord.objects.get_or_create(
                user=user,
                word_id=word_id,
                defaults={
                    'level': new_level,
                    'streak': new_streak,
                    'next_review': next_review_value,
                }
            )
            if not created:
                # Nếu đã tồn tại thì cập nhật các trường
                user_word.level = new_level
                user_word.streak = new_streak
                user_word.next_review = next_review_value
                update_list.append(user_word)
            processed_words.append(user_word)

        # Bulk update cho các đối tượng đã thay đổi
        if update_list:
            UserWord.objects.bulk_update(update_list, ['level', 'streak', 'next_review'])

        # Nếu is_review = false, cần cập nhật trạng thái cho UserLesson
        if not is_review and lesson_id is not None:
            user_lesson, created_lesson = UserLesson.objects.get_or_create(
                user=user,
                lesson_id=lesson_id,
                defaults={
                    'date_started': timezone.now(),
                    'date_completed': timezone.now(),
                }
            )
            if not created_lesson:
                user_lesson.date_completed = timezone.now()
                user_lesson.save()

        output_serializer = UserWordOutputSerializer(processed_words, many=True, context={'request': request})
        response_data = {
            "is_review": is_review,
            "lesson_id": lesson_id,
            "words": output_serializer.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='get-words')
    def get_words(self, request):
        # Sử dụng get_queryset đã tối ưu với select_related
        words = self.get_queryset()
        serializer = UserWordOutputSerializer(words, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='count_words-by-level')
    def count_words_by_level(self, request):
        # Sử dụng annotate để đếm số từ cho mỗi level chỉ trong 1 truy vấn
        counts_qs = self.get_queryset().values('level').annotate(count=Count('id'))
        result = {f"count_level{level}": 0 for level in range(1, 6)}
        for item in counts_qs:
            result[f"count_level{item['level']}"] = item['count']
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='learned-words')
    def learned_words(self, request):
        # Lấy toàn bộ các UserWord của user hiện tại (đã tối ưu với select_related nếu cần)
        user_words = self.get_queryset()
        # Phân nhóm theo level (1 đến 5)
        grouped = {level: [] for level in range(1, 6)}
        for uw in user_words:
            grouped[uw.level].append(uw)

        result = {}
        # Duyệt qua từng level và áp dụng phân trang riêng dựa trên tham số trang riêng
        for level in range(1, 6):
            paginator = LearnedWordsPagination()  # Sử dụng lớp phân trang đã định nghĩa
            # Lấy số trang riêng cho mỗi level (mặc định là 1 nếu không có tham số)
            page_number = request.query_params.get(f'page_level{level}', 1)

            # Tạo dummy_request để paginator nhận giá trị 'page'
            dummy_query_params = request.query_params.copy()
            dummy_query_params['page'] = page_number  # Gán số trang riêng cho level này
            dummy_request = type('DummyRequest', (), {'query_params': dummy_query_params})

            # Phân trang cho nhóm từ của level đó
            paginated_words = paginator.paginate_queryset(grouped[level], dummy_request)
            serializer = LearnedWordsSerializer(paginated_words, many=True, context={'request': request})

            result[f"words_by_level{level}"] = {
                "data": serializer.data,
                "total": len(grouped[level]),
                "current_page": paginator.page.number,
                "num_pages": paginator.page.paginator.num_pages
            }

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='review-words')
    def review_words(self, request):
        # Hàm get_review_ready_words() trả về cutoff_time và danh sách từ cần ôn
        cutoff_time, due_words = get_review_ready_words(request.user)
        delta = cutoff_time - timezone.now()
        total_seconds = int(delta.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        if hours < 0:
            hours = minutes = seconds = 0
        time_until_next_review = {"hours": hours, "minutes": minutes, "seconds": seconds}
        serializer = UserWordOutputSerializer(due_words, many=True, context={'request': request})
        response_data = {
            "review_word_count": due_words.count(),
            "time_until_next_review": time_until_next_review,
            "words": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
