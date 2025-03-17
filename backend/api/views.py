from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lesson, Course
from .serializers import LessonSerializer, WordSerializer, CourseSerializer, OnlyLessonSerializer
from django.db.models import Count

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().select_related('course').annotate(word_count=Count('word')).order_by('id')
    serializer_class = LessonSerializer

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
    
    @action(detail=True, methods=['GET'], url_path='words')
    def get_words(self, request, pk=None):
        lesson = get_object_or_404(Lesson, pk=pk)
        words = lesson.word_set.all()
        serializer = WordSerializer(words, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path='lessons_by_course')
    def get_lessons_by_course(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "Missing course_id"}, status=400)
        
        lessons = self.get_queryset().filter(course_id=course_id)  
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='all_lessons')
    def get_all_lessons(self, request):
        lessons = self.get_queryset()  
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)
    

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer

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
    
