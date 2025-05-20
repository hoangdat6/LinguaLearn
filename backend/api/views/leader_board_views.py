from ..serializers import LeaderBoardSerializer
from ..models import LeaderBoard
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes


@permission_classes([IsAuthenticated])
class LeaderBoardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API trả về top 10 người dùng có điểm cao nhất.
    """
    serializer_class = LeaderBoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaderBoard.objects.all()[:10]
