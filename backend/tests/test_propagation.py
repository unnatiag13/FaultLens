import pytest
from app.graph.dependency_graph import DependencyGraph
from app.models.service import Service, Dependency, ServiceStatus, FaultInjectionRequest, FaultType
from app.simulation.fault_injector import FaultInjector
from app.simulation.propagation import PropagationEngine


def test_chain_propagation():
    """
    Chain: A -> B -> C (A depends on B, B depends on C)
    If B fails: B = FAILED, A = affected (FAILED), C = HEALTHY.
    """
    graph = DependencyGraph()
    graph.add_service(Service(id="a", name="Service A"))
    graph.add_service(Service(id="b", name="Service B"))
    graph.add_service(Service(id="c", name="Service C"))

    graph.add_dependency(Dependency(source="a", target="b", critical=True))
    graph.add_dependency(Dependency(source="b", target="c", critical=True))

    graph.update_service_status("b", ServiceStatus.FAILED)
    engine = PropagationEngine(graph)
    engine.propagate(["b"])

    assert graph.get_service("b").status == ServiceStatus.FAILED
    assert graph.get_service("a").status == ServiceStatus.FAILED
    assert graph.get_service("c").status == ServiceStatus.HEALTHY


def test_branch_propagation():
    """
    Branch: A -> B, A -> C (A depends on B and C)
    If B fails: B = FAILED, A = affected (FAILED), C = HEALTHY.
    """
    graph = DependencyGraph()
    graph.add_service(Service(id="a", name="Service A"))
    graph.add_service(Service(id="b", name="Service B"))
    graph.add_service(Service(id="c", name="Service C"))

    graph.add_dependency(Dependency(source="a", target="b", critical=True))
    graph.add_dependency(Dependency(source="a", target="c", critical=True))

    graph.update_service_status("b", ServiceStatus.FAILED)
    engine = PropagationEngine(graph)
    engine.propagate(["b"])

    assert graph.get_service("b").status == ServiceStatus.FAILED
    assert graph.get_service("a").status == ServiceStatus.FAILED
    assert graph.get_service("c").status == ServiceStatus.HEALTHY


def test_non_critical_propagation():
    """
    Order -> Inventory (critical = False)
    If Inventory fails: Inventory = FAILED, Order = DEGRADED.
    """
    graph = DependencyGraph()
    graph.add_service(Service(id="order", name="Order Service"))
    graph.add_service(Service(id="inventory", name="Inventory Service"))

    graph.add_dependency(Dependency(source="order", target="inventory", critical=False))

    graph.update_service_status("inventory", ServiceStatus.FAILED)
    engine = PropagationEngine(graph)
    engine.propagate(["inventory"])

    assert graph.get_service("inventory").status == ServiceStatus.FAILED
    assert graph.get_service("order").status == ServiceStatus.DEGRADED


def test_reset_graph():
    """Verifies that reset returns all services to HEALTHY status."""
    graph = DependencyGraph()
    graph.add_service(Service(id="srv1", name="S1"))
    graph.add_service(Service(id="srv2", name="S2"))
    graph.add_dependency(Dependency(source="srv1", target="srv2", critical=True))

    injector = FaultInjector(graph)
    injector.inject_fault(FaultInjectionRequest(service_id="srv2", fault_type=FaultType.SERVICE_DOWN))

    assert graph.get_service("srv2").status == ServiceStatus.FAILED
    assert graph.get_service("srv1").status == ServiceStatus.FAILED

    graph.reset_all_statuses()
    assert graph.get_service("srv1").status == ServiceStatus.HEALTHY
    assert graph.get_service("srv2").status == ServiceStatus.HEALTHY
