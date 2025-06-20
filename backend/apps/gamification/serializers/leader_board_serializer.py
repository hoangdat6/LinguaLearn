from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.fields import CharField

from ..models import LeaderBoard


class LeaderBoardSerializer(serializers.ModelSerializer):
    """
    Serializer cho bảng xếp hạng người dùng.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = LeaderBoard
        fields = ['username', 'total_score', 'avatar']
        read_only_fields = ['username', 'total_score', 'avatar']


    @extend_schema_field(CharField)
    def get_avatar(self, obj):
        return obj.user.avatar