import os
import json
from typing import Dict, Any, List, Optional
from app.models.application import ApplicationDetail, ServiceDetail, DependencyGraphResponse, ConnectAppResponse
from app.services.compose_parser import parse_docker_compose_yaml

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
STORE_FILE = os.path.join(DATA_DIR, "store.json")

# Default Mock Datasets
SEED_APPLICATIONS = [
    {
        "id": "app-ecommerce",
        "name": "E-Commerce Platform",
        "status": "Operational with warnings",
        "statusType": "warning",
        "description": "Distributed microservices architecture powering checkout, cart, payment processing, and inventory catalog in an isolated Docker sandbox.",
        "environment": "Docker Compose (Isolated Sandbox)",
        "isolation": "Strict Container Isolation Enabled",
        "servicesCount": 8,
        "dependenciesCount": 11,
        "experimentsCount": 12,
        "activeIssues": 1,
        "lastExperiment": {
            "name": "Payment Service Failure Simulation",
            "status": "Completed",
            "result": "Impact Detected",
            "time": "2 hours ago"
        },
        "lastUpdated": "10 minutes ago",
        "repository": "github.com/engineering/ecommerce-core",
        "composeFile": "docker-compose.resilience.yml"
    },
    {
        "id": "app-crm",
        "name": "CRM & Billing Suite",
        "status": "Operational",
        "statusType": "healthy",
        "description": "Customer relations and automated billing dispatch platform running containerized worker queues and relational databases.",
        "environment": "Docker Compose (Isolated Sandbox)",
        "isolation": "Strict Container Isolation Enabled",
        "servicesCount": 6,
        "dependenciesCount": 7,
        "experimentsCount": 4,
        "activeIssues": 0,
        "lastExperiment": {
            "name": "Billing DB Replica Timeout",
            "status": "Completed",
            "result": "Resilient (Auto-failover OK)",
            "time": "Yesterday"
        },
        "lastUpdated": "1 day ago",
        "repository": "github.com/engineering/crm-billing",
        "composeFile": "docker-compose.sandbox.yml"
    },
    {
        "id": "app-streaming",
        "name": "Real-time Event Ingestion",
        "status": "Operational",
        "statusType": "healthy",
        "description": "High-throughput Kafka and consumer worker cluster validating event streaming resilience under broker network partition.",
        "environment": "Docker Compose (Isolated Sandbox)",
        "isolation": "Strict Container Isolation Enabled",
        "servicesCount": 5,
        "dependenciesCount": 6,
        "experimentsCount": 8,
        "activeIssues": 0,
        "lastExperiment": {
            "name": "Kafka Broker 2 Network Drop",
            "status": "Completed",
            "result": "Partition Handled",
            "time": "3 days ago"
        },
        "lastUpdated": "3 days ago",
        "repository": "github.com/engineering/event-pipeline",
        "composeFile": "docker-compose.cluster.yml"
    }
]

SEED_SERVICES_ECOMMERCE = [
    {
        "id": "api-gateway",
        "name": "API Gateway",
        "type": "Gateway",
        "status": "degraded",
        "statusLabel": "Degraded (High Latency)",
        "port": 8080,
        "protocol": "HTTP/2 / REST",
        "cpu": "46%",
        "memory": "54%",
        "responseTime": "420ms",
        "baselineResponseTime": "38ms",
        "errorRate": "12.4%",
        "baselineErrorRate": "0.02%",
        "requestRate": "1,420 req/s",
        "dependencies": ["auth-service", "order-service", "catalog-service"],
        "dependents": ["external-clients"],
        "description": "Public ingress reverse-proxy routing client requests with rate limiting and TLS termination.",
        "runtime": "Envoy / Go 1.22",
        "containerId": "cnt_gateway_90a"
    },
    {
        "id": "auth-service",
        "name": "Auth Service",
        "type": "Microservice",
        "status": "healthy",
        "statusLabel": "Healthy",
        "port": 8081,
        "protocol": "gRPC / JSON",
        "cpu": "18%",
        "memory": "28%",
        "responseTime": "19ms",
        "baselineResponseTime": "18ms",
        "errorRate": "0.0%",
        "baselineErrorRate": "0.0%",
        "requestRate": "340 req/s",
        "dependencies": ["postgres-db"],
        "dependents": ["api-gateway"],
        "description": "Handles JWT verification, session caching, and RBAC token rotation.",
        "runtime": "Node.js 20 LTS",
        "containerId": "cnt_auth_88c"
    },
    {
        "id": "order-service",
        "name": "Order Service",
        "type": "Microservice",
        "status": "degraded",
        "statusLabel": "Degraded (Cascading Delays)",
        "port": 8082,
        "protocol": "REST / Internal",
        "cpu": "64%",
        "memory": "71%",
        "responseTime": "1,480ms",
        "baselineResponseTime": "65ms",
        "errorRate": "18.6%",
        "baselineErrorRate": "0.05%",
        "requestRate": "410 req/s",
        "dependencies": ["payment-service", "inventory-service", "notification-service", "postgres-db"],
        "dependents": ["api-gateway"],
        "description": "Coordinates cart checkout, order validation, and transaction orchestrations.",
        "runtime": "Python 3.11 / FastAPI",
        "containerId": "cnt_order_44b"
    },
    {
        "id": "payment-service",
        "name": "Payment Service",
        "type": "Microservice",
        "status": "critical",
        "statusLabel": "FAILED (Active Experiment Target)",
        "port": 8083,
        "protocol": "HTTPS / Internal",
        "cpu": "72%",
        "memory": "78%",
        "responseTime": "3,200ms",
        "baselineResponseTime": "110ms",
        "errorRate": "34.8%",
        "baselineErrorRate": "0.1%",
        "requestRate": "88 req/s",
        "dependencies": ["postgres-db"],
        "dependents": ["order-service"],
        "description": "Manages third-party payment tokens, gateway routing, and ledger authorization.",
        "runtime": "Go 1.22 / Gin",
        "containerId": "cnt_payment_01f"
    },
    {
        "id": "inventory-service",
        "name": "Inventory Service",
        "type": "Microservice",
        "status": "healthy",
        "statusLabel": "Healthy",
        "port": 8084,
        "protocol": "gRPC",
        "cpu": "24%",
        "memory": "36%",
        "responseTime": "26ms",
        "baselineResponseTime": "24ms",
        "errorRate": "0.1%",
        "baselineErrorRate": "0.05%",
        "requestRate": "280 req/s",
        "dependencies": ["postgres-db"],
        "dependents": ["order-service"],
        "description": "Real-time stock deduction, SKU warehouse reservation, and item lock management.",
        "runtime": "Rust / Actix",
        "containerId": "cnt_inventory_33d"
    },
    {
        "id": "catalog-service",
        "name": "Product Catalog",
        "type": "Microservice",
        "status": "healthy",
        "statusLabel": "Healthy",
        "port": 8085,
        "protocol": "REST",
        "cpu": "16%",
        "memory": "32%",
        "responseTime": "15ms",
        "baselineResponseTime": "15ms",
        "errorRate": "0.0%",
        "baselineErrorRate": "0.0%",
        "requestRate": "890 req/s",
        "dependencies": ["postgres-db"],
        "dependents": ["api-gateway"],
        "description": "Read-heavy product search, category browsing, and pricing catalog.",
        "runtime": "Go 1.22",
        "containerId": "cnt_catalog_12x"
    },
    {
        "id": "notification-service",
        "name": "Notification Service",
        "type": "Worker",
        "status": "healthy",
        "statusLabel": "Healthy",
        "port": 8086,
        "protocol": "Async Worker",
        "cpu": "14%",
        "memory": "22%",
        "responseTime": "48ms",
        "baselineResponseTime": "45ms",
        "errorRate": "0.0%",
        "baselineErrorRate": "0.0%",
        "requestRate": "120 msg/s",
        "dependencies": ["postgres-db"],
        "dependents": ["order-service"],
        "description": "Asynchronous transactional email, SMS receipt, and push notification dispatcher.",
        "runtime": "Node.js 20 LTS",
        "containerId": "cnt_notif_77e"
    },
    {
        "id": "postgres-db",
        "name": "Database (PostgreSQL)",
        "type": "Database",
        "status": "healthy",
        "statusLabel": "Healthy",
        "port": 5432,
        "protocol": "PostgreSQL 16",
        "cpu": "38%",
        "memory": "62%",
        "responseTime": "7ms",
        "baselineResponseTime": "6ms",
        "errorRate": "0.0%",
        "baselineErrorRate": "0.0%",
        "requestRate": "1,850 qps",
        "dependencies": [],
        "dependents": ["order-service", "payment-service", "inventory-service", "catalog-service", "auth-service", "notification-service"],
        "description": "Primary relational database storing transactional orders, users, and audit records.",
        "runtime": "PostgreSQL 16.2 Alpine",
        "containerId": "cnt_postgres_db"
    }
]

SEED_GRAPH_ECOMMERCE = {
    "nodes": [
        {"id": "api-gateway", "type": "serviceNode", "position": {"x": 380, "y": 30}, "data": {"label": "API Gateway", "serviceType": "Gateway", "status": "degraded", "port": 8080, "responseTime": "420ms", "errorRate": "12.4%", "isTarget": False, "isAffected": True}},
        {"id": "auth-service", "type": "serviceNode", "position": {"x": 120, "y": 170}, "data": {"label": "Auth Service", "serviceType": "Microservice", "status": "healthy", "port": 8081, "responseTime": "19ms", "errorRate": "0.0%", "isTarget": False, "isAffected": False}},
        {"id": "catalog-service", "type": "serviceNode", "position": {"x": 640, "y": 170}, "data": {"label": "Product Catalog", "serviceType": "Microservice", "status": "healthy", "port": 8085, "responseTime": "15ms", "errorRate": "0.0%", "isTarget": False, "isAffected": False}},
        {"id": "order-service", "type": "serviceNode", "position": {"x": 380, "y": 170}, "data": {"label": "Order Service", "serviceType": "Microservice", "status": "degraded", "port": 8082, "responseTime": "1,480ms", "errorRate": "18.6%", "isTarget": False, "isAffected": True}},
        {"id": "payment-service", "type": "serviceNode", "position": {"x": 220, "y": 320}, "data": {"label": "Payment Service", "serviceType": "Microservice", "status": "critical", "port": 8083, "responseTime": "3,200ms", "errorRate": "34.8%", "isTarget": True, "isAffected": True}},
        {"id": "inventory-service", "type": "serviceNode", "position": {"x": 440, "y": 320}, "data": {"label": "Inventory Service", "serviceType": "Microservice", "status": "healthy", "port": 8084, "responseTime": "26ms", "errorRate": "0.1%", "isTarget": False, "isAffected": False}},
        {"id": "notification-service", "type": "serviceNode", "position": {"x": 660, "y": 320}, "data": {"label": "Notification Service", "serviceType": "Worker", "status": "healthy", "port": 8086, "responseTime": "48ms", "errorRate": "0.0%", "isTarget": False, "isAffected": False}},
        {"id": "postgres-db", "type": "serviceNode", "position": {"x": 380, "y": 470}, "data": {"label": "Database (Postgres)", "serviceType": "Database", "status": "healthy", "port": 5432, "responseTime": "7ms", "errorRate": "0.0%", "isTarget": False, "isAffected": False}}
    ],
    "edges": [
        {"id": "e-gw-auth", "source": "api-gateway", "target": "auth-service", "animated": False, "style": {"stroke": "#334155", "strokeWidth": 1.5}},
        {"id": "e-gw-catalog", "source": "api-gateway", "target": "catalog-service", "animated": False, "style": {"stroke": "#334155", "strokeWidth": 1.5}},
        {"id": "e-gw-order", "source": "api-gateway", "target": "order-service", "animated": True, "className": "edge-degraded-flow", "style": {"stroke": "#D97706", "strokeWidth": 2}},
        {"id": "e-order-payment", "source": "order-service", "target": "payment-service", "animated": True, "className": "edge-critical-flow", "style": {"stroke": "#DC2626", "strokeWidth": 2.5}},
        {"id": "e-order-inv", "source": "order-service", "target": "inventory-service", "animated": False, "style": {"stroke": "#334155", "strokeWidth": 1.5}},
        {"id": "e-order-notif", "source": "order-service", "target": "notification-service", "animated": False, "style": {"stroke": "#334155", "strokeWidth": 1.5}},
        {"id": "e-auth-db", "source": "auth-service", "target": "postgres-db", "animated": False, "style": {"stroke": "#1E293B", "strokeWidth": 1}},
        {"id": "e-payment-db", "source": "payment-service", "target": "postgres-db", "animated": False, "style": {"stroke": "#334155", "strokeWidth": 1.5}},
        {"id": "e-inv-db", "source": "inventory-service", "target": "postgres-db", "animated": False, "style": {"stroke": "#1E293B", "strokeWidth": 1}},
        {"id": "e-catalog-db", "source": "catalog-service", "target": "postgres-db", "animated": False, "style": {"stroke": "#1E293B", "strokeWidth": 1}},
        {"id": "e-notif-db", "source": "notification-service", "target": "postgres-db", "animated": False, "style": {"stroke": "#1E293B", "strokeWidth": 1}}
    ]
}


class Store:
    def __init__(self):
        self.applications: List[Dict[str, Any]] = list(SEED_APPLICATIONS)
        self.services_store: Dict[str, List[Dict[str, Any]]] = {
            "app-ecommerce": list(SEED_SERVICES_ECOMMERCE)
        }
        self.graph_store: Dict[str, Dict[str, Any]] = {
            "app-ecommerce": dict(SEED_GRAPH_ECOMMERCE)
        }
        self._load_from_disk()

    def _load_from_disk(self):
        if os.path.exists(STORE_FILE):
            try:
                with open(STORE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if "applications" in data:
                        self.applications = data["applications"]
                    if "services_store" in data:
                        self.services_store = data["services_store"]
                    if "graph_store" in data:
                        self.graph_store = data["graph_store"]
            except Exception as e:
                print(f"Error loading store from disk: {e}")

    def _save_to_disk(self):
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            with open(STORE_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "applications": self.applications,
                    "services_store": self.services_store,
                    "graph_store": self.graph_store
                }, f, indent=2)
        except Exception as e:
            print(f"Error saving store to disk: {e}")

    def get_applications(self) -> List[Dict[str, Any]]:
        return self.applications

    def get_application_by_id(self, app_id: str) -> Optional[Dict[str, Any]]:
        for app in self.applications:
            if app["id"] == app_id:
                return app
        return self.applications[0] if self.applications else None

    def get_services(self, app_id: str) -> List[Dict[str, Any]]:
        if app_id in self.services_store:
            return self.services_store[app_id]
        return self.services_store.get("app-ecommerce", [])

    def get_dependencies(self, app_id: str) -> Dict[str, Any]:
        if app_id in self.graph_store:
            return self.graph_store[app_id]
        return self.graph_store.get("app-ecommerce", {"nodes": [], "edges": []})

    def add_application(self, name: str, description: str, environment: str, compose_yaml: str, isolation: bool = True) -> Dict[str, Any]:
        import time
        import uuid

        app_id = f"app-{int(time.time()*1000):x}"
        
        # Parse docker compose YAML using our parser service
        service_details, graph_response, discovered_services, discovered_dependencies = parse_docker_compose_yaml(compose_yaml)
        
        # Serialize services and graph
        services_json = [srv.model_dump() for srv in service_details]
        graph_json = graph_response.model_dump()

        new_app = {
            "id": app_id,
            "name": name or "Custom Isolated Application",
            "status": "Connected",
            "statusType": "healthy",
            "description": description or "Imported Docker Compose configuration running in strict container isolation.",
            "environment": f"{environment or 'Testing'} (Isolated Sandbox)",
            "isolation": "Strict Container Isolation Enabled" if isolation else "Container Isolation Active",
            "servicesCount": len(service_details),
            "dependenciesCount": len(graph_response.edges),
            "experimentsCount": 0,
            "activeIssues": 0,
            "lastExperiment": {
                "name": "None",
                "status": "Unexercised",
                "result": "Ready for initial test",
                "time": "Just now"
            },
            "lastUpdated": "Just now",
            "repository": "Uploaded local docker-compose.yml",
            "composeFile": "docker-compose.yml",
            "composeYaml": compose_yaml
        }

        # Save to store
        self.applications.insert(0, new_app)
        self.services_store[app_id] = services_json
        self.graph_store[app_id] = graph_json
        self._save_to_disk()

        return {
            **new_app,
            "discoveredServices": discovered_services,
            "discoveredDependencies": discovered_dependencies,
            "graph": graph_json
        }


# Global store instance
store_instance = Store()
