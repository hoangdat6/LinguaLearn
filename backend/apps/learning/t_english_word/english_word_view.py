from rest_framework import viewsets
from ..models.t_english_word import EnglishWord
from .serializers import EnglishWordSerializer

class EnglishWordViewSet(viewsets.ModelViewSet):
    queryset = EnglishWord.objects.all().order_by('-created_at')
    serializer_class = EnglishWordSerializer


