from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConnectAppRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    environment: Optional[str] = "Testing"
    composeYaml: str = Field(..., alias="composeYaml")
    isolation: Optional[bool] = True

    class Config:
        populate_by_name = True

class ServiceDetail(BaseModel):
    id: str
    name: str
    type: str  # Gateway, Microservice, Worker, Database
    status: str = "healthy"
    statusLabel: str = "Healthy"
    port: int = 8080
    protocol: str = "HTTP / REST"
    cpu: str = "15%"
    memory: str = "25%"
    responseTime: str = "25ms"
    baselineResponseTime: str = "20ms"
    errorRate: str = "0.0%"
    baselineErrorRate: str = "0.0%"
    requestRate: str = "250 req/s"
    dependencies: List[str] = []
    dependents: List[str] = []
    description: str = ""
    runtime: str = "Docker Container"
    containerId: str = ""

class GraphNodeData(BaseModel):
    label: str
    serviceType: str
    status: str = "healthy"
    port: int = 8080
    responseTime: str = "25ms"
    errorRate: str = "0.0%"
    isTarget: bool = False
    isAffected: bool = False

class GraphNode(BaseModel):
    id: str
    type: str = "serviceNode"
    position: Dict[str, int]  # {"x": int, "y": int}
    data: GraphNodeData

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    animated: bool = False
    className: Optional[str] = ""
    style: Optional[Dict[str, Any]] = None

class DependencyGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class LastExperimentInfo(BaseModel):
    name: str = "None"
    status: str = "Unexercised"
    result: str = "Ready for initial test"
    time: str = "Just now"

class ApplicationDetail(BaseModel):
    id: str
    name: str
    status: str = "Operational"
    statusType: str = "healthy"
    description: str = ""
    environment: str = "Testing (Isolated Sandbox)"
    isolation: str = "Strict Container Isolation Enabled"
    servicesCount: int = 0
    dependenciesCount: int = 0
    experimentsCount: int = 0
    activeIssues: int = 0
    lastExperiment: LastExperimentInfo = Field(default_factory=LastExperimentInfo)
    lastUpdated: str = "Just now"
    repository: str = "Uploaded docker-compose.yml"
    composeFile: str = "docker-compose.yml"
    composeYaml: Optional[str] = ""

class ConnectAppResponse(ApplicationDetail):
    discoveredServices: List[str] = []
    discoveredDependencies: List[str] = []
    graph: DependencyGraphResponse
