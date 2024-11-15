from django.core.management.base import BaseCommand
from elasticsearch_dsl.connections import connections

class Command(BaseCommand):
    help = 'Test Elasticsearch connection'

    def handle(self, *args, **kwargs):
        es = connections.get_connection(alias='default')
        self.stdout.write(str(es.info()))
