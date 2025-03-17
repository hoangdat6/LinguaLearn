from rest_framework import serializers
from .models import Lesson, Word, Course

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'  # Hoặc có thể chọn trường cụ thể

class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True, source='word_set')  # Lấy danh sách Word của Lesson

    class Meta:
        model = Lesson
        fields = '__all__'  # Hoặc ['id', 'title', 'description', 'words']

class OnlyLessonSerializer(serializers.ModelSerializer):
    word_count = serializers.IntegerField(read_only=True)  # Thêm field word_count từ annotate()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'image', 'word_count']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  # Hoặc có thể chọn trường cụ thể