import pytest
from app.graph.dependency_graph import DependencyGraph
from app.models.service import Service, Dependency, ServiceStatus


def test_add_and_retrieve_services():
    graph = DependencyGraph()
    s1 = Service(id="srv1", name="Service 1", status=ServiceStatus.HEALTHY)
    s2 = Service(id="srv2", name="Service 2", status=ServiceStatus.HEALTHY)

    graph.add_service(s1)
    graph.add_service(s2)

    all_services = graph.get_all_services()
    assert len(all_services) == 2
    assert graph.get_service("srv1").name == "Service 1"
    assert graph.get_service("srv2").name == "Service 2"


def test_add_and_retrieve_dependencies():
    graph = DependencyGraph()
    s1 = Service(id="srv1", name="Service 1")
    s2 = Service(id="srv2", name="Service 2")
    graph.add_service(s1)
    graph.add_service(s2)

    # s1 depends on s2
    dep = Dependency(source="srv1", target="srv2", critical=True)
    graph.add_dependency(dep)

    # Dependents of s2 (services depending on s2) -> s1
    dependents_of_s2 = graph.get_dependents("srv2")
    assert dependents_of_s2 == ["srv1"]

    # Dependencies of s1 (services s1 depends on) -> s2
    dependencies_of_s1 = graph.get_dependencies("srv1")
    assert dependencies_of_s1 == ["srv2"]
