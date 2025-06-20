from rest_framework import serializers
from apps.learning.models.word import Word
from apps.progress.models.vocabulary_progress import VocabularyProgress
from apps.learning.serializers.word_serializer import WordSerializer

class VocabularyProgressInputSerializer(serializers.Serializer):
    word_id = serializers.IntegerField(required=True)
    level = serializers.IntegerField(required=True, min_value=1, max_value=5)
    streak = serializers.IntegerField(required=True, min_value=1, max_value=10)
    # is_correct được yêu cầu nếu is_review = true ở cấp cha; để đây tùy chọn:
    is_correct = serializers.BooleanField(required=False)
    question_type = serializers.CharField(required=True)

    def validate_word_id(self, value):
        if not Word.objects.filter(id=value).exists():
            raise serializers.ValidationError("Từ với ID này không tồn tại.")
        return value


class VocabularyProgressOutputSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = VocabularyProgress
        fields = '__all__'

class LearnedWordsSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = VocabularyProgress
        fields = '__all__'