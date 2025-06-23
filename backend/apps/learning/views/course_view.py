from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.learning.models.course import Course
from apps.learning.models.lesson import Lesson
from apps.learning.serializers.course_serializer import CourseSerializer
from apps.learning.serializers.lesson_serializer import LessonSerializer
from rest_framework.permissions import AllowAny
from ..schemas.course_schema import (
    list_courses_schema, retrieve_course_schema,
    get_lessons_schema, get_all_courses_schema
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get']

    @list_courses_schema
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @retrieve_course_schema
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @get_lessons_schema
    @action(detail=True, methods=['GET'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lessons = Lesson.objects.filter(course=course)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @get_all_courses_schema
    @action(detail=False, methods=['GET'], url_path='all_courses')
    def get_all_courses(self, request):
        serializer = CourseSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)
