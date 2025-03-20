from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, CourseViewSet, UserViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    # Endpoint trả về schema OpenAPI (JSON)
    path('schema/', SpectacularAPIView.as_view(), name='schema'),

    # Giao diện Swagger UI
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Giao diện Redoc UI (tùy chọn)
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
