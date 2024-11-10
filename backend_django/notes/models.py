# backend_django/notes/models.py
from django.core.exceptions import ValidationError
from django.db import models

def validate_not_empty(value):
    if not value.strip():
        raise ValidationError("This field cannot be empty.")

class Note(models.Model):
    title = models.CharField(max_length=255, validators=[validate_not_empty])
    content = models.TextField(validators=[validate_not_empty])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        if len(self.title) > 255:
            raise ValidationError("Title cannot exceed 255 characters.")
