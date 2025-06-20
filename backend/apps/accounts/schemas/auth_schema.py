# apps/accounts/schemas/auth_schema.py
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from ..serializers import (
    UserRegisterSerializer, UserLoginSerializer,
    ChangePasswordSerializer, ResetPasswordSerializer, LogoutSerializer
)


register_schema = extend_schema(
    request=UserRegisterSerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(description="Đăng ký thành công. Yêu cầu xác minh email."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Dữ liệu không hợp lệ.")
    },
    description="Đăng ký tài khoản mới và gửi email xác minh."
)

login_schema = extend_schema(
    request=UserLoginSerializer,
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Đăng nhập thành công."),
        status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description="Sai thông tin đăng nhập."),
        status.HTTP_403_FORBIDDEN: OpenApiResponse(description="Tài khoản chưa xác minh.")
    },
    description="Đăng nhập và nhận JWT token."
)

change_password_schema = extend_schema(
    request=ChangePasswordSerializer,
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Đổi mật khẩu thành công."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Dữ liệu không hợp lệ.")
    },
    description="Đổi mật khẩu cho user đã đăng nhập."
)

reset_password_schema = extend_schema(
    request=ResetPasswordSerializer,
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Gửi link đặt lại mật khẩu."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Email không tồn tại.")
    },
    description="Gửi email đặt lại mật khẩu."
)

logout_schema = extend_schema(
    request=LogoutSerializer,
    responses={
        status.HTTP_205_RESET_CONTENT: OpenApiResponse(description="Logout thành công."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ.")
    },
    description="Logout bằng cách blacklist refresh token."
)

verify_email_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="token", description="Token xác thực email", required=True, type=str)
    ],
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Xác thực email thành công."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ hoặc tài khoản đã được kích hoạt.")
    },
    description="Kích hoạt tài khoản khi người dùng nhấn vào link xác thực."
)

reset_password_confirm_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="uid", description="User ID", required=True, type=int),
        OpenApiParameter(name="token", description="Token đặt lại mật khẩu", required=True, type=str)
    ],
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "new_password": {"type": "string"},
                "confirm_password": {"type": "string"}
            },
            "required": ["new_password", "confirm_password"]
        }
    },
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Đặt lại mật khẩu thành công."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ hoặc mật khẩu không khớp.")
    },
    description="Xác nhận đặt lại mật khẩu với token hợp lệ."
)

reset_password_validate_schema = extend_schema(
    parameters=[
        OpenApiParameter(name="uid", description="User ID", required=True, type=int),
        OpenApiParameter(name="token", description="Token đặt lại mật khẩu", required=True, type=str)
    ],
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Token hợp lệ."),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description="Token không hợp lệ hoặc đã hết hạn.")
    },
    description="Kiểm tra tính hợp lệ của token đặt lại mật khẩu."
)

refresh_token_schema = extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "refresh": {"type": "string"}
            },
            "required": ["refresh"]
        }
    },
    responses={
        status.HTTP_200_OK: OpenApiResponse(description="Token mới được tạo thành công."),
        status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description="Token không hợp lệ hoặc đã hết hạn.")
    },
    description="Làm mới access token bằng refresh token."
)
