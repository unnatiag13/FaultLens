#import pytest
from app.graph.dependency_graph import DependencyGraph
from app.models.service import Service, FaultInjectionRequest, FaultType, ServiceStatus
from app.simulation.fault_injector import FaultInjector


def test_fault_injection_service_down():
    graph = DependencyGraph()
    srv = Service(id="payment", name="Payment Service", status=ServiceStatus.HEALTHY)
    graph.add_service(srv)

    injector = FaultInjector(graph)
    req = FaultInjectionRequest(service_id="payment", fault_type=FaultType.SERVICE_DOWN)

    res = injector.inject_fault(req)

    payment_service = next(s for s in res.services if s.id == "payment")
    assert payment_service.status == ServiceStatus.FAILED
