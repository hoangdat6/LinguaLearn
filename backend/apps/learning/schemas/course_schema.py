from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status

from apps.learning.serializers.course_serializer import CourseSerializer
from apps.learning.serializers.lesson_serializer import LessonSerializer

list_courses_schema = extend_schema(
    responses={
        status.HTTP_200_OK: CourseSerializer(many=True),
    },
    description="Lấy danh sách tất cả các khóa học."
)

retrieve_course_schema = extend_schema(
    responses={
        status.HTTP_200_OK: CourseSerializer,
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy khóa học"),
    },
    description="Lấy thông tin chi tiết của một khóa học cụ thể."
)

get_lessons_schema = extend_schema(
    responses={
        status.HTTP_200_OK: LessonSerializer(many=True),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy khóa học"),
    },
    description="Lấy danh sách các bài học của một khóa học cụ thể."
)

get_all_courses_schema = extend_schema(
    responses={
        status.HTTP_200_OK: CourseSerializer(many=True),
    },
    description="Lấy danh sách tất cả các khóa học (alias của list)."
)
