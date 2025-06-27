from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, APIException, AuthenticationFailed
import logging

logger = logging.getLogger(__name__)

class CustomException(Exception):
    code: int
    message: str

    def __init__(self, http_code: int, code: int, message: str):
        self.http_code = http_code if http_code else 500
        self.code = code if code else http_code
        self.message = message


def build_error_response(code, message, status_code, details=None):
    """
    Hàm chuẩn để đóng gói lỗi trả về JSON thống nhất
    """
    response_data = {
        "code": code,
        "message": message
    }
    if details is not None:
        response_data["details"] = details

    return Response(response_data, status=status_code)


def http_exception_handler(exc, context):
    """
    Custom exception handler trả về JSON lỗi đồng nhất
    """

    if isinstance(exc, CustomException):
        return build_error_response(exc.code, exc.message, exc.http_code)

    if isinstance(exc, ValidationError):
        return build_error_response(
            status.HTTP_400_BAD_REQUEST,
            "Validation failed",
            status.HTTP_400_BAD_REQUEST,
            details=exc.detail
        )

    if isinstance(exc, APIException):
        return build_error_response(
            exc.status_code,
            str(exc.detail),
            exc.status_code
        )

    if isinstance(exc, ObjectDoesNotExist):
        return build_error_response(
            status.HTTP_404_NOT_FOUND,
            "Resource not found",
            status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, (AuthenticationFailed, PermissionDenied)):
        return build_error_response(
            status.HTTP_403_FORBIDDEN,
            str(exc.detail),
            status.HTTP_403_FORBIDDEN
        )

    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return build_error_response(
        500,
        "Internal Server Error",
        status.HTTP_500_INTERNAL_SERVER_ERROR
    )