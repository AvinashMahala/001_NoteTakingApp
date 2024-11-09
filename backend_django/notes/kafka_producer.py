from kafka import KafkaProducer
import json
import time

def get_kafka_producer():
    retries = 5
    retry_delay = 5  # seconds between retries
    for attempt in range(1, retries + 1):
        try:
            print(f"Attempt {attempt}/{retries}: Connecting to Kafka...")
            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',  # Use the Kafka service name if using Docker
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                request_timeout_ms=10000,  # Increase the timeout for each connection attempt
                retries=3,                 # Number of retries for the producer itself
                retry_backoff_ms=1000      # Delay between retries in milliseconds
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

# Example usage
if __name__ == "__main__":
    note_data = {
        "title": "Sample Note",
        "content": "This is a test note",
        "timestamp": time.time()
    }
    send_note_event(note_data)
