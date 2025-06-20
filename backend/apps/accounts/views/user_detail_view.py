from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions, status

from apps.accounts.models import UserDetail
from apps.accounts.serializers import UserDetailSerializer
from ..schemas import user_detail_schema
from ..serializers.user_detail_serializer import UserProfileSerializer


class UserDetailViewSet(viewsets.GenericViewSet):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Không cần queryset chung vì ta không dùng retrieve theo pk
    def get_queryset(self):
        return UserDetail.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path="me")
    @user_detail_schema.user_detail_get_schema
    def get_me(self, request):
        """Get the current user's profile"""
        user_detail, _ = UserDetail.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(user_detail)
        return Response(serializer.data)

    @action(detail=False, methods=['put'], url_path="me")
    @user_detail_schema.user_detail_update_schema
    def update_me(self, request):
        """Update the current user's profile"""
        user_detail, _ = UserDetail.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(user_detail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='profile')
    @user_detail_schema.user_profile_schema
    def get_profile(self, request):
        user_detail = request.user.user_detail
        serializer = UserProfileSerializer(user_detail)
        return Response(serializer.data)

