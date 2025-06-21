from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import VocabularyProgress
from ..paginations import LearnedWordsPagination
from ..schemas import vocabulary_progress_schema
from ..serializers import VocabularyProgressOutputSerializer
from ..services.vocabulary_progress_service import VocabularyProgressService


@permission_classes([IsAuthenticated])
class VocabularyProgressViewSet(viewsets.ModelViewSet):
    queryset = VocabularyProgress.objects.all()
    serializer_class = VocabularyProgressOutputSerializer

    def get_queryset(self):
        # Only get data for the current user with related word info
        return VocabularyProgress.objects.filter(user=self.request.user).select_related('word')

    @action(detail=False, methods=['post'], url_path='submit-words')
    @vocabulary_progress_schema.submit_words_schema
    def submit_words(self, request):
        """
        request.data:
        {
            "is_review": true,
            "lesson_id": 12,          // Required when is_review is false
            "words": [
                {
                    "word_id": 123,
                    "level": 2,
                    "streak": 3,
                    "is_correct": true,
                    "question_type": "L2"
                }
            ]
        }
        """
        response_data = VocabularyProgressService.submit_words(
            user=request.user,
            data=request.data,
            request=request
        )
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='get-words')
    @vocabulary_progress_schema.get_words_schema
    def get_words(self, request):
        words = self.get_queryset()
        serializer = VocabularyProgressOutputSerializer(words, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='count_words-by-level')
    @vocabulary_progress_schema.count_words_by_level_schema
    def count_words_by_level(self, request):
        result = VocabularyProgressService.count_words_by_level(request.user)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='learned-words')
    @vocabulary_progress_schema.learned_words_schema
    def learned_words(self, request):
        result = VocabularyProgressService.get_learned_words(request.user, request)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='review-words')
    @vocabulary_progress_schema.review_words_schema
    def review_words(self, request):
        response_data = VocabularyProgressService.get_review_words(request.user, request)
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='learned-words-pagination')
    @vocabulary_progress_schema.learned_words_pagination_schema
    def learned_words_pagination(self, request):
        level = request.query_params.get('level', None)
        paginator = LearnedWordsPagination()
        data = VocabularyProgressService.get_learned_words_pagination(
            user=request.user,
            level=level,
            paginator=paginator,
            request=request
        )
        return Response(data, status=status.HTTP_200_OK)
