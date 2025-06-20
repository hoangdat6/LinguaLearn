from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from ..serializers import CourseProgressSerializer, LessonProgressSerializer

list_course_progress_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="page", description="Số trang", required=False, type=int),
        OpenApiParameter(name="page_size", description="Số lượng phần tử mỗi trang", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: CourseProgressSerializer(many=True),
    },
    description="Lấy danh sách các khóa học của người dùng (có phân trang)."
)

retrieve_course_progress_schema = extend_schema(
    responses={
        status.HTTP_200_OK: CourseProgressSerializer,
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy khóa học"),
    },
    description="Lấy thông tin khóa học cụ thể của người dùng."
)

get_lessons_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="page", description="Số trang", required=False, type=int),
        OpenApiParameter(name="page_size", description="Số lượng phần tử mỗi trang", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: LessonProgressSerializer(many=True),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy khóa học"),
    },
    description="Lấy danh sách các bài học của khóa học cụ thể (có phân trang)."
)
