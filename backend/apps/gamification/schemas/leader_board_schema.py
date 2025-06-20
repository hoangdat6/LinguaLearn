from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from ..serializers import LeaderBoardSerializer

leaderboard_list_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="page", description="Số trang (bắt đầu từ 1)", required=False, type=int),
        OpenApiParameter(name="page_size", description="Số lượng item mỗi trang", required=False, type=int),
    ],
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Danh sách xếp hạng người dùng",
            response={
                "type": "object",
                "properties": {
                    "count": {"type": "integer", "description": "Tổng số bản ghi"},
                    "next": {"type": "string", "format": "uri", "nullable": True, "description": "Link trang tiếp theo"},
                    "previous": {"type": "string", "format": "uri", "nullable": True, "description": "Link trang trước"},
                    "results": {"type": "array", "items": {"$ref": "#/components/schemas/LeaderBoard"}}
                }
            }
        ),
    },
    description="Lấy danh sách xếp hạng người dùng theo điểm số"
)

leaderboard_retrieve_schema = extend_schema(
    responses={
        status.HTTP_200_OK: LeaderBoardSerializer,
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Không tìm thấy bản ghi"),
    },
    description="Lấy thông tin xếp hạng của một người dùng cụ thể"
)
