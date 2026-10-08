from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.models.application import ConnectAppRequest, ApplicationDetail, ConnectAppResponse, ServiceDetail, DependencyGraphResponse
from app.services.store import store_instance

router = APIRouter(prefix="/api/v1/applications", tags=["Applications"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_applications():
    """Retrieve all connected applications."""
    return store_instance.get_applications()

@router.get("/{app_id}")
async def get_application_by_id(app_id: str):
    """Retrieve a single application by ID."""
    app = store_instance.get_application_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.post("/connect", status_code=status.HTTP_201_CREATED)
async def connect_application(payload: ConnectAppRequest):
    """
    Connect a new application by parsing docker-compose.yml,
    extracting services, building inter-service dependency graph,
    and storing topology.
    """
    if not payload.name:
        raise HTTPException(status_code=400, detail="Application name is required")
    if not payload.composeYaml:
        raise HTTPException(status_code=400, detail="docker-compose.yml configuration is required")

    result = store_instance.add_application(
        name=payload.name,
        description=payload.description or "",
        environment=payload.environment or "Testing",
        compose_yaml=payload.composeYaml,
        isolation=payload.isolation if payload.isolation is not None else True
    )
    return result

@router.get("/{app_id}/services")
async def get_application_services(app_id: str):
    """Retrieve microservices catalog for a specific application."""
    return store_instance.get_services(app_id)

@router.get("/{app_id}/dependencies")
async def get_application_dependencies(app_id: str):
    """Retrieve dependency graph (nodes and edges for @xyflow/react) for a specific application."""
    return store_instance.get_dependencies(app_id)
