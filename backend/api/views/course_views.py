from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Course
from ..serializers import CourseSerializer, LessonSerializer
from rest_framework.permissions import AllowAny


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]  # Tắt xác thực cho ViewSet này

    @action(detail=True, methods=['GET'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lessons = course.lesson_set.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path='all_courses')
    def get_all_courses(self, request):
        serializer = CourseSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)
