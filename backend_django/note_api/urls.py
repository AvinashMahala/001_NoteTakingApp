# In backend_django/note_api/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('notes.urls')),  # Adding the notes API endpoint
]
