from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.schemas import auth_schema
from ..models import CustomUser as User, UserDetail
from ..serializers import (
    UserRegisterSerializer, UserLoginSerializer, ChangePasswordSerializer,
    ResetPasswordSerializer, LogoutSerializer
)
from drf_spectacular.utils import extend_schema, OpenApiParameter


class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    @auth_schema.register_schema
    @action(detail=False, methods=["post"], url_path="register")
    def register(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        try:
            if serializer.is_valid():
                user = serializer.save()
                user.username = user.email.split('@')[0]
                user.is_active = False  # Tài khoản chưa được kích hoạt
                user.save()

                UserDetail.objects.create(user=user, name=user.username)

                verification_link = f"{settings.FE_URL}/auth/verify-email/{user.verification_token}/"

                subject = "Xác nhận email của bạn"
                plain_message = f"Chào {user.username},\nHãy xác nhận email của bạn bằng cách truy cập:\n{verification_link}\n\nNếu bạn không đăng ký, hãy bỏ qua email này."

                # Nội dung HTML email
                html_message = render_to_string("email/verify_email.html", {
                    "username": user.username,
                    "verification_link": verification_link
                })

                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    html_message=html_message,
                )

                return Response({"message": "Vui lòng kiểm tra email để xác thực tài khoản!"},
                                status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.verify_email_schema
    @action(detail=False, methods=["get"], url_path="verify-email/(?P<token>[^/.]+)")
    def verify_email(self, request, token):
        """Kích hoạt tài khoản khi người dùng nhấn vào link xác thực"""
        try:
            user = User.objects.get(verification_token=token)
            if user.is_active:
                return Response({"message": "Tài khoản đã được kích hoạt trước đó!"},
                                status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.verification_token = None
            user.save()
            return Response({"message": "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."},
                            status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Token không hợp lệ!"}, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.login_schema
    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request):
        """Đăng nhập user và trả về JWT nếu tài khoản đã được xác thực"""
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)

            if user is None:
                return Response({"error": "Tên đăng nhập hoặc mật khẩu không đúng!"},
                                status=status.HTTP_401_UNAUTHORIZED)
            if not user.is_active:
                return Response({"error": "Tài khoản chưa được xác thực qua email!"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    # "avatar": user.avatar.url if user.avatar else None,
                }
            }, status=status.HTTP_200_OK)

        # cache.delete(f"count_words_by_level_{user.id}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.change_password_schema
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        """
        Thay đổi mật khẩu của người dùng.
        Yêu cầu nhập mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới.
        """
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()
            return Response({"message": "Đổi mật khẩu thành công!"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.reset_password_schema
    @action(detail=False, methods=["post"], url_path="reset-password")
    def reset_password(self, request):
        """
        Gửi email reset mật khẩu.
        Thay vì thay đổi mật khẩu ngay lập tức, người dùng sẽ nhận được email với đường link đặt lại mật khẩu.
        """
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Email không tồn tại!"}, status=status.HTTP_400_BAD_REQUEST)

            # Tạo token reset mật khẩu
            token = default_token_generator.make_token(user)
            # Bạn có thể cấu hình lại đường link theo frontend hoặc endpoint reset cụ thể
            reset_link = f"{settings.FE_URL}/auth/reset-password/{user.pk}/{token}/"

            subject = "Đặt lại mật khẩu của bạn"
            plain_message = (
                f"Chào {user.username},\n\n"
                f"Để đặt lại mật khẩu, vui lòng truy cập đường link sau:\n"
                f"{reset_link}\n\n"
                f"Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này."
            )

            # Nếu muốn, bạn có thể tạo phiên bản HTML của email
            html_message = render_to_string("email/reset_password.html", {
                "username": user.username,
                "reset_link": reset_link
            })

            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                html_message=html_message,
            )

            return Response(
                {"message": "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.reset_password_confirm_schema
    @action(detail=False, methods=["post"], url_path=r"reset-password-confirm/(?P<uid>\d+)/(?P<token>[^/.]+)")
    def reset_password_confirm(self, request, uid, token):
        """
        Xác nhận đặt lại mật khẩu:
        - Kiểm tra token hợp lệ
        - Nhận mật khẩu mới từ request
        """
        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại!"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token không hợp lệ hoặc đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        if not new_password or not confirm_password:
            return Response({"error": "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!"},
                            status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Mật khẩu mới không khớp!"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Đặt lại mật khẩu thành công!"}, status=status.HTTP_200_OK)

    @auth_schema.reset_password_validate_schema
    @action(detail=False, methods=["get"], url_path=r"reset-password-validate/(?P<uid>\d+)/(?P<token>[^/.]+)")
    @permission_classes([AllowAny])
    def reset_password_validate(self, request, uid, token):
        """
        Kiểm tra token reset mật khẩu.
        Nếu token hợp lệ, trả về thông báo và token để frontend sử dụng.
        """
        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại!"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token không hợp lệ hoặc đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Token hợp lệ.", "token": token}, status=status.HTTP_200_OK)

    @auth_schema.logout_schema
    @action(detail=False, methods=["post"], url_path="logout")
    def logout(self, request):
        """
        Xử lý logout người dùng bằng cách blacklisting refresh token.
        Yêu cầu gửi refresh token trong request.
        """
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            # Xóa dữ liệu cache liên quan đến người dùng
            cache.delete(f"count_words_by_level_{request.user.id}")
            cache.delete(f"learned_words_{request.user.id}")
            pattern = f"usercourses:{request.user.id}:*"
            # Xóa cache cho tất cả các khóa học của user
            cache.delete_pattern(pattern) if hasattr(cache, 'delete_pattern') else cache.delete_many(cache.keys(pattern))
            
            refresh_token = serializer.validated_data.get("refresh")
            
            try:
                token = RefreshToken(refresh_token)
                # Đánh dấu token đã bị thu hồi (blacklist)
                token.blacklist()
                return Response({"message": "Logout thành công!"}, status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                return Response({"error": f"Token không hợp lệ hoặc đã được thu hồi! Lỗi: {str(e)}"},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_schema.refresh_token_schema
    @action(detail=False, methods=["post"], url_path="refresh-token")
    @permission_classes([AllowAny])
    def refresh_token(self, request):
        """
        Endpoint để refresh access token.
        Yêu cầu gửi refresh token trong header Authorization.
        """
        refresh = request.data.get("refresh")
        token = RefreshToken(refresh)
        access_token = str(token.access_token)
        refresh_token = str(token)
        return Response({"access": access_token, "refresh": refresh_token}, status=status.HTTP_200_OK)
