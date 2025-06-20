from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from apps.learning.serializers.lesson_serializer import LessonSerializer, OnlyLessonSerializer
from apps.learning.serializers.word_serializer import WordSerializer

list_lessons_schema = extend_schema(
    responses={
        status.HTTP_200_OK: LessonSerializer(many=True),
    },
    description="Lấy danh sách tất cả các bài học."
)

retrieve_lesson_schema = extend_schema(
    responses={
        status.HTTP_200_OK: LessonSerializer,
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy bài học"),
    },
    description="Lấy thông tin chi tiết của một bài học cụ thể."
)

get_top_n_lessons_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="n", description="Số lượng bài học muốn lấy", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: LessonSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Định dạng số không hợp lệ"),
    },
    description="Lấy top n bài học."
)

get_words_schema = extend_schema(
    responses={
        status.HTTP_200_OK: WordSerializer(many=True),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy bài học"),
    },
    description="Lấy danh sách từ vựng của một bài học cụ thể."
)

get_lessons_by_course_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="course_id", description="ID của khóa học", required=True, type=int),
    ],
    responses={
        status.HTTP_200_OK: OnlyLessonSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Thiếu course_id"),
    },
    description="Lấy danh sách bài học của một khóa học cụ thể."
)

get_all_lessons_schema = extend_schema(
    responses={
        status.HTTP_200_OK: OnlyLessonSerializer(many=True),
    },
    description="Lấy danh sách tất cả các bài học (chỉ thông tin cơ bản)."
)
