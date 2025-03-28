from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from ..models import Course, UserCourse, Lesson
from ..serializers import UserCourseSerializer, UserLessonSerializer
from ..pagination import CustomPagination
from django.db.models import OuterRef, Subquery, Count, IntegerField, Value
from django.db.models.functions import Coalesce

# Subquery để đếm số lesson của một Course
lesson_count_subquery = Lesson.objects.filter(course=OuterRef('pk')) \
    .values('course') \
    .annotate(cnt=Count('id')) \
    .values('cnt')

# Subquery để đếm số user course của một Course
learner_count_subquery = UserCourse.objects.filter(course=OuterRef('pk')) \
    .values('course') \
    .annotate(cnt=Count('id')) \
    .values('cnt')

class UserCourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('id').annotate(
        lesson_count=Coalesce(Subquery(lesson_count_subquery, output_field=IntegerField()), Value(0)),
        learner_count=Coalesce(Subquery(learner_count_subquery, output_field=IntegerField()), Value(0))
    )
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
        lessons = course.lesson_set.annotate(word_count=Count('word')).order_by('id')

        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = UserLessonSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = UserLessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)