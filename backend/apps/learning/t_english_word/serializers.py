from rest_framework import serializers
from ..models.t_english_word import EnglishWord

class EnglishWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnglishWord
        fields = '__all__'
