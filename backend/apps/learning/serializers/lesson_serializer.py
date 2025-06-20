from rest_framework import serializers
from apps.learning.models.lesson import Lesson
from apps.learning.serializers.word_serializer import WordSerializer
from drf_spectacular.utils import extend_schema_field
from rest_framework.fields import CharField

class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True, source='word_set') # Get the list of Word objects related to the Lesson
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    @extend_schema_field(CharField)
    def get_image(self, obj):
        return obj.image.url if obj.image else None

class OnlyLessonSerializer(serializers.ModelSerializer):
    word_count = serializers.IntegerField(read_only=True)  # Thêm field word_count từ annotate()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'image', 'word_count']

    @extend_schema_field(CharField)
    def get_image(self, obj):
        return obj.image.url if obj.image else None