from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.fields import CharField, IntegerField, BooleanField

from apps.learning.models.course import Course
from apps.progress.models.lesson_progress import LessonProgress


class CourseProgressSerializer(serializers.ModelSerializer):
    is_learned = serializers.SerializerMethodField()
    lesson_count = serializers.IntegerField(read_only=True)
    image = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    learner_count = serializers.IntegerField(read_only=True)

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
            'lesson_count',
            'progress',
            'learner_count',
        ]

    @extend_schema_field(CharField)
    def get_image(self, obj):
        return obj.image.url if obj.image else None

    @extend_schema_field(IntegerField)
    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            total_lessons = obj.lesson_count
            completed_lessons = LessonProgress.objects.filter(user=request.user, lesson__course=obj).count()

            if total_lessons > 0:
                return round((completed_lessons / total_lessons) * 100, 2)
        return 0

    @extend_schema_field(BooleanField)
    def get_is_learned(self, obj):
        return self.get_progress(obj) == 100

