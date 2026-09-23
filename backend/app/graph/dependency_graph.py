from typing import Dict, List, Optional
import networkx as nx
from app.models.service import Service, Dependency, ServiceStatus


class DependencyGraph:
    """
    Manages the service dependency graph using NetworkX.

    Edge convention:
    A -> B means 'A depends on B'.
    If B fails, service A (the predecessor of B in graph edge direction A -> B) is affected.
    """

    def __init__(self) -> None:
        self.graph = nx.DiGraph()

    def add_service(self, service: Service) -> None:
        """Adds or updates a service node in the graph."""
        self.graph.add_node(
            service.id,
            name=service.name,
            status=service.status,
        )

    def add_dependency(self, dependency: Dependency) -> None:
        """
        Adds a directed dependency edge: source -> target.
        source depends on target.
        """
        if not self.graph.has_node(dependency.source):
            raise ValueError(f"Source service '{dependency.source}' does not exist in graph.")
        if not self.graph.has_node(dependency.target):
            raise ValueError(f"Target service '{dependency.target}' does not exist in graph.")

        self.graph.add_edge(
            dependency.source,
            dependency.target,
            critical=dependency.critical,
        )

    def get_service(self, service_id: str) -> Optional[Service]:
        """Returns Service object if service_id exists, else None."""
        if not self.graph.has_node(service_id):
            return None
        node_data = self.graph.nodes[service_id]
        return Service(
            id=service_id,
            name=node_data.get("name", service_id),
            status=node_data.get("status", ServiceStatus.HEALTHY),
        )

    def update_service_status(self, service_id: str, new_status: ServiceStatus) -> None:
        """Updates the operational status of a service node."""
        if not self.graph.has_node(service_id):
            raise ValueError(f"Service '{service_id}' does not exist in graph.")
        self.graph.nodes[service_id]["status"] = new_status

    def get_all_services(self) -> List[Service]:
        """Returns a list of all services in the graph."""
        services = []
        for node_id, data in self.graph.nodes(data=True):
            services.append(
                Service(
                    id=node_id,
                    name=data.get("name", node_id),
                    status=data.get("status", ServiceStatus.HEALTHY),
                )
            )
        return services

    def get_all_dependencies(self) -> List[Dependency]:
        """Returns a list of all dependencies in the graph."""
        deps = []
        for u, v, data in self.graph.edges(data=True):
            deps.append(
                Dependency(
                    source=u,
                    target=v,
                    critical=data.get("critical", True),
                )
            )
        return deps

    def get_dependents(self, service_id: str) -> List[str]:
        """
        Returns IDs of services that depend on service_id.
        In edge convention A -> B (A depends on B), dependents of B are predecessors of B.
        """
        if not self.graph.has_node(service_id):
            return []
        return list(self.graph.predecessors(service_id))

    def get_dependencies(self, service_id: str) -> List[str]:
        """
        Returns IDs of services that service_id depends on.
        In edge convention A -> B (A depends on B), dependencies of A are successors of A.
        """
        if not self.graph.has_node(service_id):
            return []
        return list(self.graph.successors(service_id))

    def get_edge_data(self, source: str, target: str) -> Optional[Dict]:
        """Returns edge attribute dictionary for edge source -> target."""
        if self.graph.has_edge(source, target):
            return dict(self.graph.edges[source, target])
        return None

    def reset_all_statuses(self) -> None:
        """Resets all service statuses to HEALTHY."""
        for node_id in self.graph.nodes:
            self.graph.nodes[node_id]["status"] = ServiceStatus.HEALTHY
