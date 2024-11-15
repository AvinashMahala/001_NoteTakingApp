# notes/management/commands/index_notes.py
from django.core.management.base import BaseCommand
from notes.documents import NoteDocument
from notes.models import Note

class Command(BaseCommand):
    help = 'Indexes all notes in Elasticsearch'

    def handle(self, *args, **kwargs):
        notes = Note.objects.all()
        for note in notes:
            NoteDocument().update(note)
        self.stdout.write(self.style.SUCCESS('Successfully indexed all notes'))
