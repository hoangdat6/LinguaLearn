from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.learning.models.course import Course
from apps.learning.models.lesson import Lesson
from apps.learning.serializers.course_serializer import CourseSerializer
from apps.learning.serializers.lesson_serializer import LessonSerializer
from ..paginations import CustomPagination
from ..schemas.course_schema import (
    list_courses_schema, retrieve_course_schema,
    get_lessons_schema
)


class CourseViewSet(viewsets.GenericViewSet):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get']
    pagination_class = CustomPagination

    def get_queryset(self):
        return Course.objects.all().order_by('id')

    @list_courses_schema
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @retrieve_course_schema
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @get_lessons_schema
    @action(detail=True, methods=['GET'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lessons = Lesson.objects.filter(course=course)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
