from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse, OpenApiExample
from rest_framework import status
from ..serializers import VocabularyProgressOutputSerializer, LessonWordsInputSerializer, LearnedWordsSerializer

submit_words_schema = extend_schema(
    request=LessonWordsInputSerializer,
    examples=[
        OpenApiExample(
            'Submit new words',
            value={
                "is_review": False,
                "lesson_id": 12,
                "words": [
                    {
                        "word_id": 123,
                        "level": 2,
                        "streak": 3,
                        "is_correct": True,
                        "question_type": "L2"
                    }
                ]
            },
            summary="Học từ mới"
        ),
        OpenApiExample(
            'Submit review words',
            value={
                "is_review": True,
                "words": [
                    {
                        "word_id": 124,
                        "level": 3,
                        "streak": 2,
                        "is_correct": False,
                        "question_type": "L1"
                    }
                ]
            },
            summary="Ôn tập từ vựng"
        ),
    ],
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            description="Gửi tiến độ học từ thành công",
            response={
                "type": "object",
                "properties": {
                    "is_review": {"type": "boolean"},
                    "lesson_id": {"type": "integer", "nullable": True},
                    "words": {"type": "array", "items": {"$ref": "#/components/schemas/VocabularyProgressOutput"}}
                }
            }
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Dữ liệu không hợp lệ"),
    },
    description="Gửi kết quả học từ vựng hoặc ôn tập."
)

get_words_schema = extend_schema(
    responses={
        status.HTTP_200_OK: VocabularyProgressOutputSerializer(many=True),
    },
    description="Lấy danh sách tất cả từ vựng đã học của người dùng."
)

count_words_by_level_schema = extend_schema(
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Thống kê số lượng từ theo cấp độ và phân loại CEFR",
            response={
                "type": "object",
                "properties": {
                    "level_counts": {
                        "type": "object",
                        "properties": {
                            "count_level1": {"type": "integer"},
                            "count_level2": {"type": "integer"},
                            "count_level3": {"type": "integer"},
                            "count_level4": {"type": "integer"},
                            "count_level5": {"type": "integer"}
                        }
                    },
                    "cefr_group_counts": {
                        "type": "object",
                        "properties": {
                            "basic": {"type": "integer"},
                            "intermediate": {"type": "integer"},
                            "advanced": {"type": "integer"}
                        }
                    },
                    "time_until_next_review": {"type": "string"},
                    "review_word_count": {"type": "integer"},
                    "cutoff_time": {"type": "string", "format": "date-time"}
                }
            }
        ),
    },
    description="Đếm số từ vựng theo cấp độ và phân loại CEFR."
)

learned_words_schema = extend_schema(
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Danh sách từ vựng đã học phân theo cấp độ",
            response={
                "type": "object",
                "properties": {
                    "time_until_next_review": {"type": "string"},
                    "review_word_count": {"type": "integer"},
                    "level_counts": {"type": "object"},
                    "cutoff_time": {"type": "string", "format": "date-time"},
                    "words_level1": {"type": "array", "items": {"$ref": "#/components/schemas/LearnedWords"}},
                    "words_level2": {"type": "array", "items": {"$ref": "#/components/schemas/LearnedWords"}},
                    "words_level3": {"type": "array", "items": {"$ref": "#/components/schemas/LearnedWords"}},
                    "words_level4": {"type": "array", "items": {"$ref": "#/components/schemas/LearnedWords"}},
                    "words_level5": {"type": "array", "items": {"$ref": "#/components/schemas/LearnedWords"}}
                }
            }
        ),
    },
    description="Lấy danh sách từ vựng đã học phân theo cấp độ (10 từ mỗi cấp độ)."
)

review_words_schema = extend_schema(
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Danh sách từ vựng cần ôn tập",
            response={
                "type": "object",
                "properties": {
                    "words": {"type": "array", "items": {"$ref": "#/components/schemas/VocabularyProgressOutput"}}
                }
            }
        ),
    },
    description="Lấy danh sách từ vựng cần ôn tập."
)

learned_words_pagination_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="level", description="Lọc theo cấp độ từ vựng (1-5)", required=False, type=int),
        OpenApiParameter(name="page", description="Số trang", required=False, type=int),
        OpenApiParameter(name="page_size", description="Số lượng phần tử mỗi trang", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: LearnedWordsSerializer(many=True),
    },
    description="Lấy danh sách từ vựng đã học (có phân trang và lọc theo cấp độ)."
)
