from rest_framework import serializers
from .models import Lesson, Word, Course, CustomUser, UserCourse, UserLesson, UserWord
from django.contrib.auth import password_validation

class WordSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    audio = serializers.SerializerMethodField()
    class Meta:
        model = Word
        fields = '__all__' 
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None
    
    def get_audio(self, obj):
        return obj.audio.url if obj.audio else None

class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True, source='word_set')  # Lấy danh sách Word của Lesson
    image = serializers.SerializerMethodField()
    class Meta:
        model = Lesson
        fields = '__all__'  # Hoặc ['id', 'title', 'description', 'words']

    def get_image(self, obj):
        return obj.image.url if obj.image else None

class OnlyLessonSerializer(serializers.ModelSerializer):
    word_count = serializers.IntegerField(read_only=True)  # Thêm field word_count từ annotate()
    image = serializers.SerializerMethodField()
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'image', 'word_count']
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None

class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = '__all__' 
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Mật khẩu không khớp!"})
        if CustomUser.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Tên đăng nhập đã tồn tại!"})
        if CustomUser.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email đã được sử dụng!"})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")  
        user = CustomUser.objects.create_user(**validated_data, is_active=False)
        user.is_active = False
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không đúng!")
        return value

    def validate(self, attrs):
        new_password = attrs.get("new_password")
        confirm_new_password = attrs.get("confirm_new_password")
        if new_password != confirm_new_password:
            raise serializers.ValidationError("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!")
        password_validation.validate_password(new_password, self.context["request"].user)
        return attrs
    
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class UserLessonSerializer(serializers.ModelSerializer):
    is_learned = serializers.SerializerMethodField()
    word_count = serializers.IntegerField(read_only=True)
    image = serializers.SerializerMethodField()
    class Meta:
        model = Lesson
        fields = [
            'id', 
            'title', 
            'description', 
            'image', 
            'created_at', 
            'updated_at',
            'is_learned',
            'word_count'
        ]

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_is_learned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Kiểm tra nếu có bản ghi UserLesson cho user và lesson này
            return UserLesson.objects.filter(user=request.user, lesson=obj).exists()
        return False

# Serializer cho Course kèm danh sách bài học và trạng thái học của user
class UserCourseSerializer(serializers.ModelSerializer):
    is_learned = serializers.SerializerMethodField()
    # lessons = LessonWithStatusSerializer(many=True, read_only=True, source='lesson_set')
    lesson_count = serializers.IntegerField(read_only=True)  # Thêm field lesson_count từ annotate()
    # nếu bạn đã đặt related_name khác trong model Lesson thì thay đổi cho phù hợp.
    image = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = [
            'id', 
            'title', 
            'en_title', 
            'description', 
            'image', 
            'icon', 
            'is_learned', 
            'lesson_count'
        ]
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_is_learned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Kiểm tra nếu có bản ghi UserCourse cho user và course này
            return UserCourse.objects.filter(user=request.user, course=obj).exists()
        return False
       
class UserWordInputSerializer(serializers.Serializer):
    word_id = serializers.IntegerField(required=True)
    level = serializers.IntegerField(required=True, min_value=1, max_value=5)
    streak = serializers.IntegerField(required=True, min_value=1, max_value=10)
    # is_correct được yêu cầu nếu is_review = true ở cấp cha; để đây tùy chọn:
    is_correct = serializers.BooleanField(required=False)
    question_type = serializers.CharField(required=True)

    def validate_word_id(self, value):
        from .models import Word
        if not Word.objects.filter(id=value).exists():
            raise serializers.ValidationError("Từ với ID này không tồn tại.")
        return value

class UserWordOutputSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = UserWord
        fields = '__all__' 


class LessonWordsInputSerializer(serializers.Serializer):
    is_review = serializers.BooleanField(required=True)
    lesson_id = serializers.IntegerField(required=False)  # Bắt buộc nếu is_review == false
    words = UserWordInputSerializer(many=True, required=True)
    
    def validate(self, attrs):
        is_review = attrs.get("is_review")
        lesson_id = attrs.get("lesson_id")
        if not is_review and lesson_id is None:
            raise serializers.ValidationError({
                "lesson_id": "Trường này là bắt buộc khi is_review là False."
            })
        return attrs

    def validate_lesson_id(self, value):
        from .models import Lesson
        if not Lesson.objects.filter(id=value).exists():
            raise serializers.ValidationError("Lesson với ID này không tồn tại.")
        return value
    
class LearnedWordsSerializer(serializers.ModelSerializer):
    word = WordSerializer()
    class Meta:
        model = UserWord
        fields = '__all__'