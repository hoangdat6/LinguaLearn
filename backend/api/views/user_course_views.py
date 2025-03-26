from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from ..models import Course
from ..serializers import UserCourseSerializer, UserLessonSerializer
from ..pagination import CustomPagination

@permission_classes([IsAuthenticated])
class UserCourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('id').annotate(lesson_count=Count('lesson'))
    serializer_class = UserCourseSerializer
    pagination_class = CustomPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=True, methods=['get'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        """
        Lấy danh sách các bài học của khóa học cụ thể (có phân trang).
        URL mẫu: /api/user-courses/<course_id>/lessons/
        """
        course = self.get_object()  
        lessons = course.lesson_set.all().order_by('id').annotate(word_count=Count('word'))
        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = UserLessonSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = UserLessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)
