from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lesson, Course, CustomUser as User, UserWord, UserLesson
from .utils.calculate_next_review import calculate_next_review
from .utils.get_review_ready_words import get_review_ready_words
from .serializers import LessonSerializer, WordSerializer, CourseSerializer, OnlyLessonSerializer, UserRegisterSerializer, UserLoginSerializer, ChangePasswordSerializer, ResetPasswordSerializer, LogoutSerializer
from .serializers import UserCourseSerializer, UserLessonSerializer, UserWordInputSerializer, UserWordOutputSerializer, LessonWordsInputSerializer, LearnedWordsSerializer
from django.contrib.auth import authenticate
from django.db.models import Count
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .pagination import CustomPagination, LearnedWordsPagination
from django.utils import timezone

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().select_related('course').annotate(word_count=Count('word')).order_by('id')
    serializer_class = LessonSerializer

    @action(detail=False, methods=['GET'], url_path='top')
    def get_top_n_lessons(self, request):
        n = request.query_params.get('n', 3)
        try:
            n = int(n)
        except ValueError:
            return Response({"error": "Invalid number format"}, status=400)

        lessons = self.get_queryset()[:n]
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'], url_path='words')
    def get_words(self, request, pk=None):
        lesson = get_object_or_404(Lesson, pk=pk)
        words = lesson.word_set.all()
        serializer = WordSerializer(words, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='lessons_by_course')
    def get_lessons_by_course(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "Missing course_id"}, status=400)

        lessons = self.get_queryset().filter(course_id=course_id)
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='all_lessons')
    def get_all_lessons(self, request):
        lessons = self.get_queryset()
        serializer = OnlyLessonSerializer(lessons, many=True)
        return Response(serializer.data)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer

    @action(detail=True, methods=['GET'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lessons = course.lesson_set.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='all_courses')
    def get_all_courses(self, request):
        serializer = CourseSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    @action(detail=False, methods=["post"], url_path="register")
    def register(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Tài khoản chưa được kích hoạt
            user.save()

            verification_link = f"http://localhost:8000/api/users/verify-email/{user.verification_token}/"

            subject = "Xác nhận email của bạn"
            plain_message = f"Chào {user.username},\nHãy xác nhận email của bạn bằng cách truy cập:\n{verification_link}\n\nNếu bạn không đăng ký, hãy bỏ qua email này."

            # Nội dung HTML email
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }}
                .header {{
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }}
                .content {{
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 25px;
                    margin: 20px 0;
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }}
                .footer {{
                    background-color: #f4f4f4;
                    color: #777777;
                    text-align: center;
                    font-size: 12px;
                    padding: 10px;
                }}
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2>Xác nhận Email</h2>
                </div>
                <div class="content">
                    <p>Chào {user.username},</p>
                    <p>Cảm ơn bạn đã đăng ký. Vui lòng xác nhận email của bạn bằng cách nhấn vào nút bên dưới:</p>
                    <p style="text-align: center;">
                    <a href="{verification_link}" class="button">Xác nhận Email</a>
                    </p>
                    <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán đường dẫn sau vào trình duyệt của mình:</p>
                    <p>{verification_link}</p>
                </div>
                <div class="footer">
                    <p>Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
                </div>
                </div>
            </body>
            </html>
            """

            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                html_message=html_message,
            )

            return Response({"message": "Vui lòng kiểm tra email để xác thực tài khoản!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="verify-email/(?P<token>[^/.]+)")
    def verify_email(self, request, token):
        """Kích hoạt tài khoản khi người dùng nhấn vào link xác thực"""
        try:
            user = User.objects.get(verification_token=token)
            if user.is_active:
                return Response({"message": "Tài khoản đã được kích hoạt trước đó!"}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.verification_token = None
            user.save()
            return Response({"message": "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Token không hợp lệ!"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request):
        """Đăng nhập user và trả về JWT nếu tài khoản đã được xác thực"""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)

            if user is None:
                return Response({"error": "Tên đăng nhập hoặc mật khẩu không đúng!"}, status=status.HTTP_401_UNAUTHORIZED)
            if not user.is_active:
                return Response({"error": "Tài khoản chưa được xác thực qua email!"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
            reset_link = f"http://localhost:8000/api/users/reset-password-validate/{user.pk}/{token}/"

            subject = "Đặt lại mật khẩu của bạn"
            plain_message = (
                f"Chào {user.username},\n\n"
                f"Để đặt lại mật khẩu, vui lòng truy cập đường link sau:\n"
                f"{reset_link}\n\n"
                f"Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này."
            )

            # Nếu muốn, bạn có thể tạo phiên bản HTML của email
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 30px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }}
                    .header {{
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-align: center;
                        padding: 20px;
                    }}
                    .content {{
                        padding: 30px;
                        color: #333333;
                        line-height: 1.6;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 12px 25px;
                        margin: 20px 0;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }}
                    .footer {{
                        background-color: #f4f4f4;
                        color: #777777;
                        text-align: center;
                        font-size: 12px;
                        padding: 10px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Đặt lại mật khẩu</h2>
                    </div>
                    <div class="content">
                        <p>Chào {user.username},</p>
                        <p>Để đặt lại mật khẩu, vui lòng nhấn vào nút bên dưới:</p>
                        <p style="text-align: center;">
                            <a href="{reset_link}" class="button">Đặt lại mật khẩu</a>
                        </p>
                        <p>Nếu nút trên không hoạt động, hãy sao chép và dán đường link sau vào trình duyệt:</p>
                        <p>{reset_link}</p>
                    </div>
                    <div class="footer">
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
                    </div>
                </div>
            </body>
            </html>
            """

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
            return Response({"error": "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Mật khẩu mới không khớp!"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Đặt lại mật khẩu thành công!"}, status=status.HTTP_200_OK)

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

    @action(detail=False, methods=["post"], url_path="logout")
    def logout(self, request):
        """
        Xử lý logout người dùng bằng cách blacklisting refresh token.
        Yêu cầu gửi refresh token trong request.
        """
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data.get("refresh")
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"message": "Logout thành công!"}, status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                return Response({"error": "Token không hợp lệ hoặc đã được thu hồi!"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="test_auth")
    @permission_classes([IsAuthenticated])
    def test(self, request):
        return Response({"message": "Đã xác thực!"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="refresh-token")
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

    @action(detail=False, methods=["get"], url_path="profile")
    @permission_classes([IsAuthenticated])
    def profile(self, request):
        user = request.user
        return Response({"username": user.username, "avatar": user.avatar}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class UserCourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('id').annotate(lesson_count=Count('lesson'))
    serializer_class = UserCourseSerializer
    pagination_class = CustomPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=True, methods=['get'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        """
        Lấy danh sách các bài học của khóa học cụ thể (có phân trang).
        URL mẫu: /api/user-courses/<course_id>/lessons/
        """
        course = self.get_object()
        lessons = course.lesson_set.all().order_by('id').annotate(word_count=Count('word'))
        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = UserLessonSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = UserLessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class UserLessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all().order_by('id').annotate(word_count=Count('word'))
    serializer_class = UserLessonSerializer
    pagination_class = CustomPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=True, methods=['get'], url_path='words')
    def get_words(self, request, pk=None):
        """
        Lấy danh sách từ vựng của bài học cụ thể mà không phân trang.
        URL mẫu: /api/user-lessons/<lesson_id>/words/
        """
        lesson = self.get_object()
        words = lesson.word_set.all()
        serializer = WordSerializer(words, many=True, context={'request': request})
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class UserWordViewSet(viewsets.ModelViewSet):
    queryset = UserWord.objects.all()
    serializer_class = UserWordOutputSerializer

    def get_queryset(self):
        # Chỉ lấy dữ liệu của user hiện tại và lấy luôn thông tin của word
        return UserWord.objects.filter(user=self.request.user).select_related('word')

    @action(detail=False, methods=['post'], url_path='submit-lesson-words')
    def submit_lesson_words(self, request):
        """
        Input:
        {
            "is_review": true,
            "lesson_id": 12,          // Bắt buộc khi is_review là false
            "words": [
                {
                    "word_id": 123,
                    "level": 2,
                    "streak": 3,
                    "is_correct": true,
                    "question_type": "L2"
                },
                {
                    "word_id": 124,
                    "level": 3,
                    "streak": 2,
                    "is_correct": false,
                    "question_type": "L1"
                }
            ]
        }
        """
        parent_serializer = LessonWordsInputSerializer(data=request.data)
        parent_serializer.is_valid(raise_exception=True)
        validated_data = parent_serializer.validated_data

        is_review = validated_data['is_review']
        lesson_id = validated_data.get('lesson_id', None)
        words_data = validated_data['words']
        user = request.user

        processed_words = []
        update_list = []
        for word_data in words_data:
            word_id = word_data['word_id']
            level = word_data['level']
            streak = word_data['streak']
            question_type = word_data['question_type']
            is_correct = word_data.get('is_correct', None)

            if not is_review:
                # Nếu không phải ôn, reset level và streak
                new_level = 1
                new_streak = 1
            else:
                if is_correct is False:
                    new_streak = 1
                    new_level = max(level - 1, 1)
                else:
                    new_streak = min(10, streak + 1)
                    new_level = min(level + 1, 5)

            next_review_value = calculate_next_review(new_level, new_streak, question_type)

            # Tìm hoặc tạo đối tượng UserWord
            user_word, created = UserWord.objects.get_or_create(
                user=user,
                word_id=word_id,
                defaults={
                    'level': new_level,
                    'streak': new_streak,
                    'next_review': next_review_value,
                }
            )
            if not created:
                # Nếu đã tồn tại thì cập nhật các trường
                user_word.level = new_level
                user_word.streak = new_streak
                user_word.next_review = next_review_value
                update_list.append(user_word)
            processed_words.append(user_word)

        # Bulk update cho các đối tượng đã thay đổi
        if update_list:
            UserWord.objects.bulk_update(update_list, ['level', 'streak', 'next_review'])

        # Nếu is_review = false, cần cập nhật trạng thái cho UserLesson
        if not is_review and lesson_id is not None:
            user_lesson, created_lesson = UserLesson.objects.get_or_create(
                user=user,
                lesson_id=lesson_id,
                defaults={
                    'date_started': timezone.now(),
                    'date_completed': timezone.now(),
                }
            )
            if not created_lesson:
                user_lesson.date_completed = timezone.now()
                user_lesson.save()

        output_serializer = UserWordOutputSerializer(processed_words, many=True, context={'request': request})
        response_data = {
            "is_review": is_review,
            "lesson_id": lesson_id,
            "words": output_serializer.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='get-words')
    def get_words(self, request):
        # Sử dụng get_queryset đã tối ưu với select_related
        words = self.get_queryset()
        serializer = UserWordOutputSerializer(words, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='count_words-by-level')
    def count_words_by_level(self, request):
        # Sử dụng annotate để đếm số từ cho mỗi level chỉ trong 1 truy vấn
        counts_qs = self.get_queryset().values('level').annotate(count=Count('id'))

        result = {f"count_level{level}": 0 for level in range(1, 6)}
        result["basic"] = 0
        result["intermediate"] = 0
        result["advanced"] = 0
        for item in counts_qs:
            result[f"count_level{item['level']}"] = item['count']
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='learned-words')
    def learned_words(self, request):
        # Lấy toàn bộ các UserWord của user hiện tại (đã tối ưu với select_related nếu cần)
        user_words = self.get_queryset()
        # Phân nhóm theo level (1 đến 5)
        grouped = {level: [] for level in range(1, 6)}
        for uw in user_words:
            grouped[uw.level].append(uw)

        result = {}
        # Duyệt qua từng level và áp dụng phân trang riêng dựa trên tham số trang riêng
        for level in range(1, 6):
            paginator = LearnedWordsPagination()  # Sử dụng lớp phân trang đã định nghĩa
            # Lấy số trang riêng cho mỗi level (mặc định là 1 nếu không có tham số)
            page_number = request.query_params.get(f'page_level{level}', 1)

            # Tạo dummy_request để paginator nhận giá trị 'page'
            dummy_query_params = request.query_params.copy()
            dummy_query_params['page'] = page_number  # Gán số trang riêng cho level này
            dummy_request = type('DummyRequest', (), {'query_params': dummy_query_params})

            # Phân trang cho nhóm từ của level đó
            paginated_words = paginator.paginate_queryset(grouped[level], dummy_request)
            serializer = LearnedWordsSerializer(paginated_words, many=True, context={'request': request})

            result[f"words_by_level{level}"] = {
                "data": serializer.data,
                "total": len(grouped[level]),
                "current_page": paginator.page.number,
                "num_pages": paginator.page.paginator.num_pages
            }

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='review-words')
    def review_words(self, request):
        # Hàm get_review_ready_words() trả về cutoff_time và danh sách từ cần ôn
        cutoff_time, due_words = get_review_ready_words(request.user)
        delta = cutoff_time - timezone.now()
        total_seconds = int(delta.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        if hours < 0:
            hours = minutes = seconds = 0
        time_until_next_review = {"hours": hours, "minutes": minutes, "seconds": seconds}
        serializer = UserWordOutputSerializer(due_words, many=True, context={'request': request})
        response_data = {
            "review_word_count": due_words.count(),
            "time_until_next_review": time_until_next_review,
            "words": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)

