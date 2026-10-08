import urllib.request
import json

url = "http://127.0.0.1:8000/api/v1/applications/connect"
payload = {
    "name": "Fintech Core Gateway",
    "description": "High availability payment processing engine",
    "environment": "Testing",
    "composeYaml": """version: '3.8'

services:
  ingress-gateway:
    image: envoyproxy/envoy:v1.28
    ports:
      - "8080:8080"
    depends_on:
      - transaction-service
      - user-service

  transaction-service:
    image: payment/tx:v1
    ports:
      - "8082:8082"
    depends_on:
      - postgres-db

  user-service:
    image: payment/user:v1
    ports:
      - "8081:8081"
    depends_on:
      - postgres-db

  postgres-db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
"""
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        print(f"Status: {res.status}")
        print(f"Created App ID: {data.get('id')}")
        print(f"App Name: {data.get('name')}")
        print(f"Services Count: {data.get('servicesCount')}")
        print(f"Dependencies Count: {data.get('dependenciesCount')}")
        print("Discovered Services:", data.get("discoveredServices"))
        print("Discovered Dependencies:", data.get("discoveredDependencies"))
except Exception as e:
    print("Error testing connect endpoint:", e)
