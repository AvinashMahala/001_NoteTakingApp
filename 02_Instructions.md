
---

## Prerequisites

Ensure you have the following installed on your machine:

- **Docker**: Required for containerization.
- **Docker Compose**: To run multi-container applications.
- **Kafka and Zookeeper**: For the message broker (can be configured with Docker).
- **Redis**: For caching (optional but recommended for better performance).
- **Node.js and npm**: For running the React frontend.
- **Python 3.9+**: Required for Django and Flask backends.

---

## 1. Clone the Repository

```bash
git clone https://github.com/AvinashMahala/001_NoteTakingApp.git
cd NoteTakingApp
```

---

## 2. Environment Configuration

### a. Set Up Environment Variables

1. Create a `.env` file in the root directory to manage environment variables for all services.
2. Add the following environment variables based on your configuration:

   ```env
   # Django Settings
   DJANGO_SECRET_KEY=your_secret_key
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost

   # Database (optional if using SQLite for local testing)
   DATABASE_URL=postgres://username:password@localhost:5432/yourdatabase

   # Redis (for caching, optional but recommended)
   REDIS_URL=redis://localhost:6379/1

   # Kafka Settings
   KAFKA_BOOTSTRAP_SERVERS=localhost:9092
   KAFKA_TOPIC=note_events

   # JWT Settings
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

### b. Update `docker-compose.yml` with Environment Variables

Ensure that `docker-compose.yml` references the environment variables defined in `.env` for each service.

---

## 3. Start Kafka and Zookeeper Services

If Kafka and Zookeeper are not already running locally, you can start them using Docker Compose:

```bash
docker-compose up -d zookeeper kafka
```

- This command starts the Zookeeper and Kafka services in the background.
- Ensure that Kafka is available at `localhost:9092` and Zookeeper at `localhost:2181`.

---

## 4. Build and Run Services with Docker Compose

1. **Build and Start the Application**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build Docker images for the React frontend, Django API backend, Flask microservice, Kafka, and Redis (if configured).
   - Start all services defined in the `docker-compose.yml` file, including the React frontend, Django, Flask, Kafka, and Redis.

2. **Access the Application**:
   - **Frontend (React)**: http://localhost:3000
   - **Backend API (Django)**: http://localhost:8000/api/notes/
   - **Microservice (Flask)**: http://localhost:5000

---

## 5. Verify Kafka Topic Creation

If Kafka is running, verify that the topic `note_events` is created. If it isn’t, create it manually:

```bash
docker exec -it kafka /bin/bash
kafka-topics.sh --create --topic note_events --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
exit
```

This ensures that Kafka is set up to handle messages from the Django API producer and the Flask consumer.

---

## 6. Running the Application Without Docker (Optional)

If you prefer to run services without Docker, follow these instructions:

### a. Run Kafka and Zookeeper Locally
1. Start Zookeeper:
   ```bash
   zookeeper-server-start.sh config/zookeeper.properties
   ```

2. Start Kafka:
   ```bash
   kafka-server-start.sh config/server.properties
   ```

### b. Run Django API
1. Navigate to the Django backend folder:
   ```bash
   cd backend_django
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start Django server:
   ```bash
   python manage.py runserver
   ```

### c. Run Flask Consumer
1. In a separate terminal, navigate to the Flask microservice folder:
   ```bash
   cd backend_flask
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

### d. Run the React Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

---

## 7. Testing the Application

1. **Create a Note via the API**:
   - Use Postman or `curl` to send a POST request to Django to create a new note:
     ```bash
     curl -X POST http://localhost:8000/api/notes/ -H "Content-Type: application/json" -d '{"title": "Sample Note", "content": "This is a sample note"}'
     ```

2. **Check for Kafka Message Consumption**:
   - View logs in the Flask service to confirm that Kafka messages are being consumed when notes are created or updated in Django.

---

## 8. Troubleshooting

- **Kafka Connection Errors**: Ensure Kafka and Zookeeper are running on the correct ports (`localhost:9092` for Kafka and `localhost:2181` for Zookeeper).
- **Django Database Errors**: If using a database other than SQLite, ensure the database is set up and credentials are correct in `.env`.
- **CORS Issues**: Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes `http://localhost:3000` for the React frontend.

---
