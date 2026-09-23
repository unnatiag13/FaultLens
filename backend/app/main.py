from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.graph.dependency_graph import DependencyGraph
from app.models.service import Service, Dependency, ServiceStatus
from app.simulation.fault_injector import FaultInjector


def create_initial_graph() -> DependencyGraph:
    """Initializes the default 6-service simulated system dependency graph."""
    graph = DependencyGraph()

    # Create Services
    services = [
        Service(id="gateway", name="API Gateway", status=ServiceStatus.HEALTHY),
        Service(id="auth", name="Auth Service", status=ServiceStatus.HEALTHY),
        Service(id="order", name="Order Service", status=ServiceStatus.HEALTHY),
        Service(id="payment", name="Payment Service", status=ServiceStatus.HEALTHY),
        Service(id="inventory", name="Inventory Service", status=ServiceStatus.HEALTHY),
        Service(id="database", name="Primary Database", status=ServiceStatus.HEALTHY),
    ]

    for s in services:
        graph.add_service(s)

    # Create Dependencies (A -> B means A depends on B)
    dependencies = [
        Dependency(source="gateway", target="auth", critical=True),
        Dependency(source="auth", target="order", critical=True),
        Dependency(source="order", target="payment", critical=True),
        Dependency(source="order", target="inventory", critical=False),
        Dependency(source="payment", target="database", critical=True),
        Dependency(source="inventory", target="database", critical=True),
    ]

    for dep in dependencies:
        graph.add_dependency(dep)

    return graph


app = FastAPI(
    title="FaultLens Resilience Simulator API",
    description="Graph-Driven Continuous Resilience Simulator & Auto-Remediation Patch Generator (Phase 1 Prototype)",
    version="0.1.0",
)

# CORS Configuration for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize application graph and fault injector on app state
graph = create_initial_graph()
app.state.graph = graph
app.state.fault_injector = FaultInjector(graph)

# Register routes
app.include_router(router)


@app.get("/")
def read_root():
    return {"message": "FaultLens API backend is running.", "phase": "Phase 1 Prototype"}
