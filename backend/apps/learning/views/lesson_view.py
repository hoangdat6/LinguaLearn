from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.learning.models.lesson import Lesson
from apps.learning.models.word import Word
from apps.learning.serializers.lesson_serializer import LessonSerializer
from apps.learning.serializers.word_serializer import WordSerializer
from ..schemas.lesson_schema import (
    list_lessons_schema, retrieve_lesson_schema, get_words_schema
)


class LessonViewSet(viewsets.GenericViewSet):
    serializer_class = LessonSerializer
    http_method_names = ['get']

    def get_queryset(self):
        return Lesson.objects.all().select_related('course').annotate(
            word_count=Count('word')
        ).order_by('id')

    @list_lessons_schema
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    @retrieve_lesson_schema
    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lesson = get_object_or_404(queryset, pk=kwargs['pk'])
        serializer = self.get_serializer(lesson)
        return Response(serializer.data)


    @get_words_schema
    @action(detail=True, methods=['GET'], url_path='words')
    def get_words(self, request, pk=None):
        lesson = get_object_or_404(Lesson, pk=pk)
        words = Word.objects.filter(lesson=lesson)
        serializer = WordSerializer(words, many=True)
        return Response(serializer.data)
