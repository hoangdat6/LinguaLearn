from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status

google_auth_schema = extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "id_token": {"type": "string", "description": "Google OAuth2 ID token"}
            },
            "required": ["id_token"]
        }
    },
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Xác thực thành công",
            response={
                "type": "object",
                "properties": {
                    "refresh": {"type": "string"},
                    "access": {"type": "string"},
                    "user": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "username": {"type": "string"},
                            "email": {"type": "string"},
                            "avatar": {"type": "string", "nullable": True}
                        }
                    }
                }
            }
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ hoặc thiếu thông tin"),
        status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(description="Lỗi máy chủ")
    },
    description="Đăng nhập với tài khoản Google"
)

facebook_auth_schema = extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "access_token": {"type": "string", "description": "Facebook OAuth access token"}
            },
            "required": ["access_token"]
        }
    },
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description="Xác thực thành công",
            response={
                "type": "object",
                "properties": {
                    "refresh": {"type": "string"},
                    "access": {"type": "string"},
                    "user": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "username": {"type": "string"},
                            "email": {"type": "string"},
                            "avatar": {"type": "string", "nullable": True}
                        }
                    }
                }
            }
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ hoặc thiếu thông tin"),
        status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(description="Lỗi máy chủ")
    },
    description="Đăng nhập với tài khoản Facebook"
)
