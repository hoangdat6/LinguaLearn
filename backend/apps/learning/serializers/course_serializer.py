from rest_framework import serializers
from apps.learning.models.course import Course
from drf_spectacular.utils import extend_schema_field
from rest_framework.fields import CharField


class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    @extend_schema_field(CharField)
    def get_image(self, obj) -> str:
        return obj.image.url if obj.image else None