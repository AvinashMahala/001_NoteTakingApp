from django.core.cache import cache

def get_note_from_cache(note_id):
    note = cache.get(f'note_{note_id}')
    if not note:
        note = Note.objects.get(id=note_id)
        cache.set(f'note_{note_id}', note, timeout=60*5)  # Cache for 5 minutes
    return note
