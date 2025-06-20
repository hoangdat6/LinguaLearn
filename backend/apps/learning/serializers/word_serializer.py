from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.fields import CharField

from apps.learning.models.word import Word


class WordSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    audio = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = ['id', 'word', 'pronunciation', 'pos', 'meaning',
                  'example', 'example_vi', 'image', 'audio', 'cefr'
                  ]

    @extend_schema_field(CharField)
    def get_image(self, obj):
        return obj.image.url if obj.image else None

    @extend_schema_field(CharField)
    def get_audio(self, obj):
        return obj.audio.url if obj.audio else None
