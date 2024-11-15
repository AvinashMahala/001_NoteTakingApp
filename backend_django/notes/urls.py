# notes/urls.py
from django.urls import path, include
from .views import search_notes, show_urls, NoteViewSet
from rest_framework.routers import DefaultRouter

# Set up the router for the NoteViewSet
router = DefaultRouter()
router.register(r'notes', NoteViewSet)

# Define URL patterns
urlpatterns = [
    path('api/notes/search/', search_notes, name='search_notes'),  # Endpoint for search
    path('api/show-urls/', show_urls, name='show_urls'),  # Endpoint for viewing all URLs (debugging)
    path('api/', include(router.urls)),  # NoteViewSet endpoints
]
