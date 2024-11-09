from kafka import KafkaProducer
import json
import time

def get_kafka_producer():
    retries = 5
    for i in range(retries):
        try:
            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            return producer
        except Exception as e:
            print(f"Kafka connection failed: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)
    raise Exception("Could not connect to Kafka after multiple retries")

producer = get_kafka_producer()

def send_note_event(note_data):
    producer.send('note_events', note_data)
    producer.flush()
