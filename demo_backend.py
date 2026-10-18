
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import time
import psycopg

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "database"),
    "port": 5432,
    "dbname": os.getenv("POSTGRES_DB", "faultlens_demo"),
    "user": os.getenv("POSTGRES_USER", "demo_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "demo_password"),
}


def connect_db():
    return psycopg.connect(**DB_CONFIG)


def initialize_database():
    for attempt in range(15):
        try:
            with connect_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS demo_items (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL
                        )
                    """)
                    cur.execute("""
                        INSERT INTO demo_items (name)
                        SELECT 'FaultLens demo item'
                        WHERE NOT EXISTS (
                            SELECT 1 FROM demo_items
                        )
                    """)
            print("Database connected successfully", flush=True)
            return
        except psycopg.OperationalError:
            print("Waiting for database...", flush=True)
            time.sleep(2)

    raise RuntimeError("Could not connect to PostgreSQL")


class DemoAPI(BaseHTTPRequestHandler):

    def send_json(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/":
            self.send_json(200, {
                "message": "FaultLens Demo API is running"
            })
            return

        if self.path == "/health":
            self.send_json(200, {"status": "healthy"})
            return

        if self.path == "/db-check":
            try:
                with connect_db() as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT 1")
                        cur.fetchone()

                self.send_json(200, {
                    "database": "connected"
                })
            except psycopg.OperationalError:
                self.send_json(503, {
                    "database": "unavailable"
                })
            return

        if self.path == "/items":
            try:
                with connect_db() as conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            "SELECT id, name FROM demo_items ORDER BY id"
                        )
                        rows = cur.fetchall()

                self.send_json(200, {
                    "items": [
                        {"id": row[0], "name": row[1]}
                        for row in rows
                    ]
                })
            except psycopg.OperationalError:
                self.send_json(503, {
                    "error": "Database unavailable"
                })
            return

        self.send_json(404, {"error": "Endpoint not found"})


initialize_database()

server = HTTPServer(("0.0.0.0", 8001), DemoAPI)
print("FaultLens Demo API running on port 8001", flush=True)
server.serve_forever()
