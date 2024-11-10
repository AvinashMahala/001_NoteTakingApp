# In backend_django/notes/views.py
from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import Note
from .serializers import NoteSerializer
from .kafka_producer import send_note_event  # Import the Kafka producer function

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

    # Override the create method to produce a Kafka message when a note is created
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()  # Save the new note to the database

        # Prepare the message data
        note_data = {
            "action": "create",
            "note": {
                "id": note.id,
                "title": note.title,
                "content": note.content,
                "created_at": note.created_at.isoformat(),
                "updated_at": note.updated_at.isoformat(),
            }
        }

        # Send the message to Kafka
        send_note_event(note_data)

        # Return the created note data as the response
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Override the update method to produce a Kafka message when a note is updated
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()  # Update the note in the database

        # Prepare the message data
        note_data = {
            "action": "update",
            "note": {
                "id": note.id,
                "title": note.title,
                "content": note.content,
                "created_at": note.created_at.isoformat(),
                "updated_at": note.updated_at.isoformat(),
            }
        }

        # Send the message to Kafka
        send_note_event(note_data)

        # Return the updated note data as the response
        return Response(serializer.data, status=status.HTTP_200_OK)
