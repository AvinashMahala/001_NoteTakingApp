# backend_django/notes/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Note
from .serializers import NoteSerializer
from .kafka_producer import send_note_event  # Import the Kafka producer function

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()
        
        # Send message to Kafka
        note_data = NoteSerializer(note).data
        note_data["action"] = "create"
        send_note_event(note_data)
        
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
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        note_data = NoteSerializer(instance).data
        note_data["action"] = "delete"
        
        # Send delete message to Kafka
        send_note_event(note_data)

        # Delete the note
        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
