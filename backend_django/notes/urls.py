from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet)  # Register the viewset

urlpatterns = [
    path('', include(router.urls)),
]
