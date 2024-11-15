# backend_django/notes/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.cache import cache
from .models import Note
from .serializers import NoteSerializer
from .kafka_producer import send_note_event  # Import the Kafka producer function
import logging
from faker import Faker

logger = logging.getLogger(__name__)

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

    @action(detail=False, methods=['get'], url_path='cached_notes')
    def cached_notes(self, request, *args, **kwargs):
        # Check if notes are cached
        cached_notes = cache.get('notes_list')
        if cached_notes:
            logger.info("Cache hit for notes list")
            print("Cache hit for notes list")
            return Response(cached_notes)

        logger.info("Cache miss for notes list")
        print("Cache miss for notes list")
        # Fetch notes from database if not in cache
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        notes_data = serializer.data

        # Cache the notes data for 5 minutes (300 seconds)
        cache.set('notes_list', notes_data, timeout=300)

        return Response(notes_data)

    @action(detail=False, methods=['post'], url_path='generate_dummy_data')
    def generate_dummy_data(self, request):
        fake = Faker()
        dummy_notes = []

        # Create 100 dummy notes
        for _ in range(100):
            note = Note(
                title=fake.sentence(nb_words=6),
                content=fake.paragraph(nb_sentences=3),
                # Add any other fields you need to populate with fake data
            )
            note.save()
            dummy_notes.append(note)

        serializer = NoteSerializer(dummy_notes, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()
        
        # Send message to Kafka
        note_data = NoteSerializer(note).data
        note_data["action"] = "create"
        send_note_event(note_data)
        
        # Invalidate the cache
        cache.delete('notes_list')

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()

        # Send message to Kafka
        note_data = NoteSerializer(note).data
        note_data["action"] = "update"
        send_note_event(note_data)
        
        # Invalidate the cache
        cache.delete('notes_list')

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        note_data = NoteSerializer(instance).data
        note_data["action"] = "delete"
        
        # Send delete message to Kafka
        send_note_event(note_data)

        # Delete the note
        instance.delete()
        
        # Invalidate the cache
        cache.delete('notes_list')

        return Response(status=status.HTTP_204_NO_CONTENT)
