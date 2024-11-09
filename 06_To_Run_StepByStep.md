Sure, let’s go through the setup from the beginning to ensure your Django application produces messages to Kafka upon creating or updating a note. Here’s a step-by-step guide.

---

### Step 1: Set Up Django Project and App

1. **Create a Django Project**:
   ```bash
   django-admin startproject note_api
   cd note_api
   ```

2. **Create an App for Notes**:
   ```bash
   python manage.py startapp notes
   ```

3. **Add the App to Installed Apps**:
   - Open `note_api/settings.py` and add `'notes'` and `'rest_framework'` to `INSTALLED_APPS`.

   ```python
   INSTALLED_APPS = [
       # other default apps...
       'rest_framework',
       'notes',
   ]
   ```

4. **Set Up Database Migrations**:
   - Run migrations to set up the database.
   ```bash
   python manage.py migrate
   ```

---

### Step 2: Define the Note Model

1. **Define a `Note` Model** in `notes/models.py`:

   ```python
   from django.db import models

   class Note(models.Model):
       title = models.CharField(max_length=100)
       content = models.TextField()
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)

       def __str__(self):
           return self.title
   ```

2. **Run Migrations for the `Note` Model**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

---

### Step 3: Set Up Kafka Producer

1. **Install Kafka Python Library**:
   ```bash
   pip install kafka-python
   ```

2. **Create a Kafka Producer Utility**:
   - In your `notes` app, create a file called `kafka_producer.py`.

   ```python
   from kafka import KafkaProducer
   import json

   producer = KafkaProducer(
       bootstrap_servers='localhost:9092',  # Change this if your Kafka server runs on a different host/port
       value_serializer=lambda v: json.dumps(v).encode('utf-8')
   )

   def send_note_event(note_data):
       producer.send('note_events', note_data)  # 'note_events' is the Kafka topic
       producer.flush()  # Ensure the message is sent immediately
   ```

   - Here, `send_note_event` sends messages to a Kafka topic called `note_events`. 

---

### Step 4: Create Serializer for the Note Model

1. **Create a Serializer in `notes/serializers.py`**:
   - This will allow us to convert `Note` instances to JSON format.

   ```python
   from rest_framework import serializers
   from .models import Note

   class NoteSerializer(serializers.ModelSerializer):
       class Meta:
           model = Note
           fields = ['id', 'title', 'content', 'created_at', 'updated_at']
   ```

---

### Step 5: Create Views for Notes with Kafka Integration

1. **Define a ViewSet for Notes in `notes/views.py`**:
   - This `NoteViewSet` will handle CRUD operations for the `Note` model. We’ll override the `create` and `update` methods to trigger Kafka events when a note is created or updated.

   ```python
   from rest_framework import status, viewsets
   from rest_framework.response import Response
   from .models import Note
   from .serializers import NoteSerializer
   from .kafka_producer import send_note_event  # Import the Kafka producer function

   class NoteViewSet(viewsets.ModelViewSet):
       queryset = Note.objects.all()
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
                   "updated_at": note.updated_at.isoformat()
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
                   "updated_at": note.updated_at.isoformat()
               }
           }

           # Send the message to Kafka
           send_note_event(note_data)

           # Return the updated note data as the response
           return Response(serializer.data, status=status.HTTP_200_OK)
   ```

---

### Step 6: Set Up URLs

1. **Create a Router for the `NoteViewSet` in `notes/urls.py`**:

   ```python
   from django.urls import path, include
   from rest_framework.routers import DefaultRouter
   from .views import NoteViewSet

   router = DefaultRouter()
   router.register(r'notes', NoteViewSet)

   urlpatterns = [
       path('', include(router.urls)),
   ]
   ```

2. **Include the Notes URLs in the Main `urls.py`**:

   ```python
   from django.contrib import admin
   from django.urls import path, include

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('notes.urls')),  # Assuming your app is named `notes`
   ]
   ```

---

### Step 7: Start Kafka and Zookeeper

1. **Start Zookeeper**:
   ```bash
   zookeeper-server-start.sh config/zookeeper.properties
   ```

2. **Start Kafka**:
   ```bash
   kafka-server-start.sh config/server.properties
   ```

3. **Create Kafka Topic (Optional)**:
   - Ensure the `note_events` topic exists. If not, create it manually:
     ```bash
     kafka-topics.sh --create --topic note_events --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
     ```

---

### Step 8: Start the Django Server

1. **Run the Django Development Server**:
   ```bash
   python manage.py runserver 8080
   ```

---

### Step 9: Test the API and Kafka Messaging

1. **Test Note Creation with Postman or `curl`**:
   - Use Postman or `curl` to send a POST request to create a new note.

   ```bash
   curl -X POST http://localhost:8080/api/notes/ -H "Content-Type: application/json" -d '{"title": "New Note", "content": "This is a test note"}'
   ```

2. **Test Note Update with Postman or `curl`**:
   - Assuming a note with ID 1 exists, send a PUT request to update it.

```bash
curl -X POST http://localhost:8080/api/notes/ -H "Content-Type: application/json" -d "{\"title\": \"New Note\", \"content\": \"This is a test note\"}"
```

3. **Verify Kafka Messages**:
   - Set up a Kafka consumer to listen to the `note_events` topic and verify the messages are received correctly.

---

```bash
curl -X POST http://localhost:8080/api/notes/ -H "Content-Type: application/json" -d "{\"title\": \"New Note\", \"content\": \"This is a test note\"}"
```

### Steps to Check

1. **Start the Django Server on Port 8080**:
   - If you haven’t already, explicitly start Django on port 8080:
     ```bash
     python manage.py runserver 8080
     ```

2. **Verify Server Accessibility**:
   - Open `http://localhost:8080` in your browser to ensure that the server is running on that port.

3. **Retry the `curl` Command**:
   - Execute the `curl` command again with port 8080.


