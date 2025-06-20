from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.fields import CharField, BooleanField

from apps.learning.models.lesson import Lesson
from apps.progress.models.lesson_progress import LessonProgress
from apps.progress.serializers.vocabulary_progress import VocabularyProgressInputSerializer


class LessonProgressSerializer(serializers.ModelSerializer):
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

    @extend_schema_field(CharField)
    def get_image(self, obj):
        return obj.image.url if obj.image else None

    @extend_schema_field(BooleanField)
    def get_is_learned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Kiểm tra nếu có bản ghi UserLesson cho user và lesson này
            return LessonProgress.objects.filter(user=request.user, lesson=obj).exists()
        return False

class LessonWordsInputSerializer(serializers.Serializer):
    is_review = serializers.BooleanField(required=True)
    lesson_id = serializers.IntegerField(required=False)  # Bắt buộc nếu is_review == false
    words = VocabularyProgressInputSerializer(many=True, required=True)


    def validate(self, attrs):
        is_review = attrs.get("is_review")
        lesson_id = attrs.get("lesson_id")
        if not is_review and lesson_id is None:
            raise serializers.ValidationError({
                "lesson_id": "Trường này là bắt buộc khi is_review là False."
            })
        return attrs

    def validate_lesson_id(self, value):
        if not Lesson.objects.filter(id=value).exists():
            raise serializers.ValidationError("Lesson với ID này không tồn tại.")
        return value
