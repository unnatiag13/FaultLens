from collections import deque
from typing import List, Dict
from app.graph.dependency_graph import DependencyGraph
from app.models.service import ServiceStatus

STATUS_SEVERITY: Dict[ServiceStatus, int] = {
    ServiceStatus.HEALTHY: 0,
    ServiceStatus.DEGRADED: 1,
    ServiceStatus.FAILED: 2,
}


class PropagationEngine:
    """
    Traverses the dependency graph to calculate failure propagation.

    Propagation rules:
    - Queue-based BFS starting from affected service(s).
    - If service B is FAILED:
      - Dependent service A with edge A -> B (critical=True) becomes FAILED.
      - Dependent service A with edge A -> B (critical=False) becomes DEGRADED.
    - If service B is DEGRADED:
      - Dependent service A becomes DEGRADED if currently HEALTHY.
    - If dependent service status changes to higher severity, it is added to queue
      to propagate further upstream.
    """

    def __init__(self, graph: DependencyGraph) -> None:
        self.graph = graph

    def propagate(self, initial_affected_ids: List[str]) -> None:
        """Propagates failure state changes through dependent services in graph."""
        queue: deque[str] = deque(initial_affected_ids)
        visited_transitions = set()

        while queue:
            current_id = queue.popleft()
            current_service = self.graph.get_service(current_id)
            if not current_service:
                continue

            current_status = current_service.status
            if current_status == ServiceStatus.HEALTHY:
                continue

            dependents = self.graph.get_dependents(current_id)
            for dependent_id in dependents:
                dependent_service = self.graph.get_service(dependent_id)
                if not dependent_service:
                    continue

                edge_data = self.graph.get_edge_data(dependent_id, current_id)
                is_critical = edge_data.get("critical", True) if edge_data else True

                # Determine proposed status based on current_status and edge criticality
                if current_status == ServiceStatus.FAILED:
                    proposed_status = ServiceStatus.FAILED if is_critical else ServiceStatus.DEGRADED
                elif current_status == ServiceStatus.DEGRADED:
                    proposed_status = ServiceStatus.DEGRADED
                else:
                    proposed_status = ServiceStatus.HEALTHY

                # Update if proposed status is strictly more severe
                current_dep_severity = STATUS_SEVERITY[dependent_service.status]
                proposed_severity = STATUS_SEVERITY[proposed_status]

                transition_key = (current_id, dependent_id, proposed_status)
                if proposed_severity > current_dep_severity and transition_key not in visited_transitions:
                    visited_transitions.add(transition_key)
                    self.graph.update_service_status(dependent_id, proposed_status)
                    queue.append(dependent_id)
