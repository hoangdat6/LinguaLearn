from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from ..serializers import UserDetailSerializer
from ..serializers.user_detail_serializer import UserProfileSerializer

user_detail_get_schema = extend_schema(
    responses={
        status.HTTP_200_OK: UserDetailSerializer,
    },
    description="Lấy thông tin chi tiết của người dùng hiện tại"
)

user_detail_update_schema = extend_schema(
    request=UserDetailSerializer,
    responses={
        status.HTTP_200_OK: UserDetailSerializer,
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Dữ liệu không hợp lệ")
    },
    description="Cập nhật thông tin chi tiết của người dùng hiện tại"
)


user_profile_schema = extend_schema(
    responses={
        status.HTTP_200_OK: UserProfileSerializer,
    },
    description="Lấy thông tin profile của người dùng hiện tại"
)
