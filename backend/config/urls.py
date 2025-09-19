from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularSwaggerView, SpectacularRedocView, SpectacularJSONAPIView

urlpatterns = [
    path('api/schema/', SpectacularJSONAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/progress/', include('apps.progress.urls')),
    path('api/learning/', include('apps.learning.urls')),
    path('api/gamification/', include('apps.gamification.urls')),
    path('api/accounts/', include('apps.accounts.urls')),
]
