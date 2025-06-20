from django.core.cache import cache
from rest_framework import viewsets
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ..models import LeaderBoard
from ..paginations import LeaderBoardPagination
from ..serializers import LeaderBoardSerializer
from ..schemas.leader_board_schema import leaderboard_list_schema, leaderboard_retrieve_schema


class LeaderBoardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API trả về bảng xếp hạng người dùng.
    """
    serializer_class = LeaderBoardSerializer
    # permission_classes = [IsAuthenticated]
    pagination_class = LeaderBoardPagination

    def get_queryset(self):
        return LeaderBoard.objects.all()

    @leaderboard_list_schema
    def list(self, request, *args, **kwargs):
        page_number = request.query_params.get('page', 1)
        cache_key = f'leaderboard_page_{page_number}'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response = self.get_paginated_response(serializer.data)
            cache.set(cache_key, paginated_response.data, timeout=60 * 10)  
            return Response(paginated_response.data)  

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @leaderboard_retrieve_schema
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
