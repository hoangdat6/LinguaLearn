from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count
from apps.learning.models.lesson import Lesson
from apps.learning.models.word import Word
from apps.learning.serializers.lesson_serializer import LessonSerializer, OnlyLessonSerializer
from apps.learning.serializers.word_serializer import WordSerializer
from ..schemas.lesson_schema import (
    list_lessons_schema, retrieve_lesson_schema, get_top_n_lessons_schema,
    get_words_schema, get_lessons_by_course_schema, get_all_lessons_schema
)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.all().select_related('course').annotate(
            word_count=Count('word')
        ).order_by('id')

    @list_lessons_schema
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @retrieve_lesson_schema
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @get_top_n_lessons_schema
    @action(detail=False, methods=['GET'], url_path='top')
    def get_top_n_lessons(self, request):
        n = request.query_params.get('n', 3)
        try:
            n = int(n)
        except ValueError:
            return Response({"error": "Invalid number format"}, status=400)

        lessons = self.get_queryset()[:n]
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @get_words_schema
    @action(detail=True, methods=['GET'], url_path='words')
    def get_words(self, request, pk=None):
        lesson = get_object_or_404(Lesson, pk=pk)
        words = Word.objects.filter(lesson=lesson)
        serializer = WordSerializer(words, many=True)
        return Response(serializer.data)

    @get_lessons_by_course_schema
    @action(detail=False, methods=['GET'], url_path='lessons_by_course')
    def get_lessons_by_course(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "Missing course_id"}, status=400)

        lessons = self.get_queryset().filter(course_id=course_id)
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @get_all_lessons_schema
    @action(detail=False, methods=['GET'], url_path='all_lessons')
    def get_all_lessons(self, request):
        lessons = self.get_queryset()
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)
