from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from apps.learning.serializers import WordSerializer
from ..serializers import LessonProgressSerializer

list_lesson_progress_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="page", description="Số trang", required=False, type=int),
        OpenApiParameter(name="page_size", description="Số lượng phần tử mỗi trang", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: LessonProgressSerializer(many=True),
    },
    description="Lấy danh sách tiến độ bài học của người dùng hiện tại."
)

retrieve_lesson_progress_schema = extend_schema(
    responses={
        status.HTTP_200_OK: LessonProgressSerializer,
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy bài học"),
    },
    description="Lấy thông tin tiến độ của một bài học cụ thể."
)

get_words_schema = extend_schema(
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Danh sách từ vựng của bài học",
            response={
                "type": "object",
                "properties": {
                    "lesson_id": {"type": "integer"},
                    "lesson_title": {"type": "string"},
                    "lesson_description": {"type": "string"},
                    "words": {"type": "array", "items": {"$ref": "#/components/schemas/Word"}}
                }
            }
        ),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy bài học"),
    },
    description="Lấy danh sách từ vựng của một bài học cụ thể, bao gồm cả thông tin bài học."
)
