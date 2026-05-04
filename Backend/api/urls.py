from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import firebase_auth, TaskViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('auth/', firebase_auth),
    path('', include(router.urls)),
]