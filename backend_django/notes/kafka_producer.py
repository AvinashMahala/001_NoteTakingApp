from dotenv import load_dotenv
import os
import json
import time
from kafka import KafkaProducer

# Load the appropriate .env file based on environment
env_file = ".env.docker" if os.getenv("DOCKER_ENV") == "1" else ".env.local"
load_dotenv(env_file)

def get_kafka_producer():
    retries = 5
    retry_delay = 5  # seconds between retries

    # Get Kafka server address from environment variables
    kafka_server = os.getenv("KAFKA_SERVER", "localhost:9092")

    for attempt in range(1, retries + 1):
        try:
            print(f"Attempt {attempt}/{retries}: Connecting to Kafka at {kafka_server}...")
            producer = KafkaProducer(
                bootstrap_servers=kafka_server,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                request_timeout_ms=10000,
                retries=3,
                retry_backoff_ms=1000
            )
            print("Kafka connection established.")
            return producer
        except Exception as e:
            print(f"Kafka connection failed on attempt {attempt}: {e}")
            if attempt < retries:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("Exceeded maximum retry attempts. Could not connect to Kafka.")
    raise Exception("Could not connect to Kafka after multiple retries")

# Initialize the Kafka producer
producer = get_kafka_producer()

def send_note_event(note_data):
    try:
        print("Sending event to Kafka...")
        producer.send('note_events', note_data)
        producer.flush()  # Ensure the message is sent
        print("Event sent successfully.")
    except Exception as e:
        print(f"Failed to send event to Kafka: {e}")
