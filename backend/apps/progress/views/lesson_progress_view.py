from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.learning.models import Lesson
from apps.learning.serializers import WordSerializer
from ..paginations import CustomPagination
from ..serializers import LessonProgressSerializer
from ..schemas.lesson_progress_schema import (
    list_lesson_progress_schema, retrieve_lesson_progress_schema, get_words_schema
)


@permission_classes([IsAuthenticated])
class LessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all().order_by('id').annotate(word_count=Count('word')).prefetch_related('word_set')
    serializer_class = LessonProgressSerializer
    pagination_class = CustomPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    @list_lesson_progress_schema
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @retrieve_lesson_progress_schema
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @get_words_schema
    @action(detail=True, methods=['get'], url_path='words')
    def get_words(self, request, pk=None):
        """
        Lấy danh sách từ vựng của bài học cụ thể mà không phân trang.
        URL mẫu: /api/user-lessons/<lesson_id>/words/
        """
        lesson = self.get_object()
        words = lesson.word_set.all()
        serializer = WordSerializer(words, many=True, context={'request': request})
        return Response(
            {
                'lesson_id': lesson.id,
                'lesson_title': lesson.title,
                'lesson_description': lesson.description,
                'words': serializer.data
            }
        )
