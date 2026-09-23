from enum import Enum
from pydantic import BaseModel, Field


class ServiceStatus(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    FAILED = "FAILED"


class FaultType(str, Enum):
    SERVICE_DOWN = "SERVICE_DOWN"


class Service(BaseModel):
    id: str = Field(..., description="Unique service identifier")
    name: str = Field(..., description="Human-readable service name")
    status: ServiceStatus = Field(default=ServiceStatus.HEALTHY, description="Current operational status")


class Dependency(BaseModel):
    source: str = Field(..., description="Service ID that depends on target (A in A -> B)")
    target: str = Field(..., description="Service ID being depended on (B in A -> B)")
    critical: bool = Field(default=True, description="Whether failure of target causes source to fail")


class FaultInjectionRequest(BaseModel):
    service_id: str = Field(..., description="Target service ID for fault injection")
    fault_type: FaultType = Field(default=FaultType.SERVICE_DOWN, description="Type of fault to inject")
