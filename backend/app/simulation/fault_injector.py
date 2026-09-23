from app.graph.dependency_graph import DependencyGraph
from app.models.service import FaultInjectionRequest, FaultType, ServiceStatus
from app.models.system import SystemStateResponse
from app.simulation.propagation import PropagationEngine


class FaultInjector:
    """
    Handles fault injection into system services and triggers propagation.
    """

    def __init__(self, graph: DependencyGraph) -> None:
        self.graph = graph
        self.propagation_engine = PropagationEngine(graph)

    def inject_fault(self, request: FaultInjectionRequest) -> SystemStateResponse:
        """
        Injects specified fault into target service and propagates consequences.
        """
        service = self.graph.get_service(request.service_id)
        if not service:
            raise ValueError(f"Service with ID '{request.service_id}' not found.")

        if request.fault_type == FaultType.SERVICE_DOWN:
            self.graph.update_service_status(request.service_id, ServiceStatus.FAILED)
            self.propagation_engine.propagate([request.service_id])
        else:
            raise NotImplementedError(f"Fault type '{request.fault_type}' is not yet supported in Phase 1.")

        return SystemStateResponse(
            services=self.graph.get_all_services(),
            dependencies=self.graph.get_all_dependencies(),
        )
