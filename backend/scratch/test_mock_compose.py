import urllib.request
import json

url = "http://127.0.0.1:8000/api/v1/applications/connect"
mock_compose = """version: '3.8'

services:
  api-gateway:
    image: envoyproxy/envoy:v1.28-latest
    ports:
      - "8080:8080"
    depends_on:
      - auth-service
      - order-service
      - catalog-service

  auth-service:
    image: ecom/auth-service:v2.1
    ports:
      - "8081:8081"

  order-service:
    image: ecom/order-service:v3.4
    ports:
      - "8082:8082"

  payment-service:
    image: ecom/payment-service:v1.9
    ports:
      - "8083:8083"

  inventory-service:
    image: ecom/inventory-service:v2.0
    ports:
      - "8084:8084"

  catalog-service:
    image: ecom/catalog-service:v1.5
    ports:
      - "8085:8085"

  notification-service:
    image: ecom/notif-worker:v1.2
    depends_on:
      - postgres-db

  postgres-db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
"""

payload = {
    "name": "E-Commerce Microservice Architecture",
    "description": "Full multi-tier docker compose deployment",
    "environment": "Testing",
    "composeYaml": mock_compose
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode("utf-8"))
    print("Services Discovered:")
    for srv in data.get("discoveredServices", []):
        print("  -", srv)
