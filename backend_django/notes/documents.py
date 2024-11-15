# notes/documents.py
from django_elasticsearch_dsl import Document, Index
from django_elasticsearch_dsl.registries import registry
from .models import Note

# Define the Elasticsearch index
note_index = Index('notes')

@registry.register_document
class NoteDocument(Document):
    class Index:
        # Name of the Elasticsearch index
        name = 'notes'
        # Configure settings
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Note  # The model associated with this document

        # Only specify fields that need to be indexed
        fields = [
            'title',
            'content',
            'created_at',
        ]
