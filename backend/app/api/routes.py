from fastapi import APIRouter, HTTPException, Request
from app.models.service import FaultInjectionRequest
from app.models.system import SystemStateResponse

router = APIRouter(prefix="/api", tags=["Simulation"])


@router.get("/system", response_model=SystemStateResponse)
def get_system_state(request: Request) -> SystemStateResponse:
    """Returns current system services, statuses, and dependency graph edge state."""
    graph = request.app.state.graph
    return SystemStateResponse(
        services=graph.get_all_services(),
        dependencies=graph.get_all_dependencies(),
    )


@router.post("/faults/inject", response_model=SystemStateResponse)
def inject_fault(fault_req: FaultInjectionRequest, request: Request) -> SystemStateResponse:
    """Injects a fault into a specified service and propagates failure across graph."""
    injector = request.app.state.fault_injector
    try:
        updated_state = injector.inject_fault(fault_req)
        return updated_state
    except ValueError as err:
        raise HTTPException(status_code=440, detail=str(err))
    except NotImplementedError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.post("/system/reset", response_model=SystemStateResponse)
def reset_system_state(request: Request) -> SystemStateResponse:
    """Resets all services back to HEALTHY status."""
    graph = request.app.state.graph
    graph.reset_all_statuses()
    return SystemStateResponse(
        services=graph.get_all_services(),
        dependencies=graph.get_all_dependencies(),
    )
