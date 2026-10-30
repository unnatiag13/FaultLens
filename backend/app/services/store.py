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

SEED_EXPERIMENTS = [
    {
        "id": "exp-101",
        "name": "Payment Service Failure Simulation",
        "applicationId": "app-ecommerce",
        "applicationName": "E-Commerce Platform",
        "targetServiceId": "payment-service",
        "targetServiceName": "Payment Service",
        "faultType": "Service Failure",
        "severity": "High",
        "duration": 60,
        "elapsed": 60,
        "status": "Recovered",
        "result": "Impact Detected",
        "confidence": "Evaluated (Active Topology)",
        "date": "Earlier today",
        "timestamp": "2026-10-30T12:04:20+00:00",
        "description": "Simulate complete payment gateway service crash in isolated environment to observe checkout failure cascades.",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": False,
        "affectedServices": ["order-service", "api-gateway", "external-clients"],
        "levelMap": {
            "payment-service": 0,
            "order-service": 1,
            "api-gateway": 2,
            "external-clients": 3
        }
    },
    {
        "id": "exp-102",
        "name": "Order Service High Latency Test",
        "applicationId": "app-ecommerce",
        "applicationName": "E-Commerce Platform",
        "targetServiceId": "order-service",
        "targetServiceName": "Order Service",
        "faultType": "High Latency",
        "severity": "Medium",
        "duration": 90,
        "elapsed": 90,
        "status": "Recovered",
        "result": "Cascading Delays Propagated to API Gateway",
        "confidence": "Evaluated (Active Topology)",
        "date": "Yesterday",
        "timestamp": "2026-10-29T16:30:00+00:00",
        "description": "Inject 1500ms jitter and network delay on order fulfillment handler.",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": False,
        "affectedServices": ["api-gateway", "external-clients"],
        "levelMap": {
            "order-service": 0,
            "api-gateway": 1,
            "external-clients": 2
        }
    },
    {
        "id": "exp-103",
        "name": "PostgreSQL Connection Exhaustion",
        "applicationId": "app-ecommerce",
        "applicationName": "E-Commerce Platform",
        "targetServiceId": "postgres-db",
        "targetServiceName": "Database (Postgres)",
        "faultType": "DB Connection Saturation",
        "severity": "Critical",
        "duration": 45,
        "elapsed": 45,
        "status": "Recovered",
        "result": "Connection pool ceiling reached",
        "confidence": "Evaluated (Active Topology)",
        "date": "2 days ago",
        "timestamp": "2026-10-28T14:15:00+00:00",
        "description": "Simulate connection pool exhaustion on shared relational database.",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": False,
        "affectedServices": ["order-service", "auth-service", "catalog-service", "inventory-service", "notification-service", "api-gateway"],
        "levelMap": {
            "postgres-db": 0,
            "order-service": 1,
            "auth-service": 1,
            "catalog-service": 1,
            "inventory-service": 1,
            "notification-service": 1,
            "api-gateway": 2
        }
    },
    {
        "id": "exp-104",
        "name": "API Gateway 503 Outage Test",
        "applicationId": "app-ecommerce",
        "applicationName": "E-Commerce Platform",
        "targetServiceId": "api-gateway",
        "targetServiceName": "API Gateway",
        "faultType": "HTTP 503",
        "severity": "High",
        "duration": 60,
        "elapsed": 60,
        "status": "Recovered",
        "result": "Direct Ingress Outage",
        "confidence": "Evaluated (Active Topology)",
        "date": "3 days ago",
        "timestamp": "2026-10-27T10:00:00+00:00",
        "description": "Simulate ingress reverse-proxy returning HTTP 503 Service Unavailable.",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": False,
        "affectedServices": ["external-clients"],
        "levelMap": {
            "api-gateway": 0,
            "external-clients": 1
        }
    }
]


class Store:
    def __init__(self):
        self.applications: List[Dict[str, Any]] = list(SEED_APPLICATIONS)
        self.services_store: Dict[str, List[Dict[str, Any]]] = {
            "app-ecommerce": list(SEED_SERVICES_ECOMMERCE)
        }
        self.graph_store: Dict[str, Dict[str, Any]] = {
            "app-ecommerce": dict(SEED_GRAPH_ECOMMERCE)
        }
        self.experiments: List[Dict[str, Any]] = []
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
                    if "experiments" in data:
                        self.experiments = data["experiments"]
            except Exception as e:
                print(f"Error loading store from disk: {e}")

        # Ensure seed experiments are available if not present
        existing_ids = {e.get("id") for e in self.experiments}
        for seed_exp in SEED_EXPERIMENTS:
            if seed_exp["id"] not in existing_ids:
                self.experiments.append(seed_exp)

    def _save_to_disk(self):
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            with open(STORE_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "applications": self.applications,
                    "services_store": self.services_store,
                    "graph_store": self.graph_store,
                    "experiments": self.experiments
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

    def get_experiment_by_id(self, exp_id: str) -> Optional[Dict[str, Any]]:
        for exp in self.experiments:
            if exp.get("id") == exp_id:
                return exp
        for exp in SEED_EXPERIMENTS:
            if exp.get("id") == exp_id:
                return exp
        return None

    def get_services(self, app_id: str) -> List[Dict[str, Any]]:
        if app_id in self.services_store:
            return self.services_store[app_id]
        return self.services_store.get("app-ecommerce", [])

    def get_dependencies(self, app_id: str) -> Dict[str, Any]:
        if app_id in self.graph_store:
            return self.graph_store[app_id]
        return self.graph_store.get("app-ecommerce", {"nodes": [], "edges": []})

    def compute_affected_services(self, app_id: str, target_service_id: str):
        """
        Traverses the dependency graph starting from target_service_id,
        respecting dependency direction (identifying callers/dependents that depend on the failed service).
        Returns (affected_services_list, level_map).
        """
        services = self.get_services(app_id)
        graph = self.get_dependencies(app_id)
        edges = graph.get("edges", [])

        callers_map = {srv.get("id"): set() for srv in services}

        for srv in services:
            sid = srv.get("id")
            for dep in srv.get("dependencies", []):
                if dep in callers_map:
                    callers_map[dep].add(sid)
            for caller in srv.get("dependents", []):
                if sid in callers_map:
                    callers_map[sid].add(caller)

        for edge in edges:
            src = edge.get("source")
            tgt = edge.get("target")
            if tgt in callers_map and src in callers_map:
                callers_map[tgt].add(src)

        level_map = {target_service_id: 0}
        queue = [target_service_id]
        visited = {target_service_id}

        while queue:
            curr = queue.pop(0)
            curr_level = level_map[curr]
            for caller in callers_map.get(curr, set()):
                if caller not in visited:
                    visited.add(caller)
                    level_map[caller] = curr_level + 1
                    queue.append(caller)

        affected = [sid for sid in level_map.keys() if sid != target_service_id]
        return affected, level_map

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
