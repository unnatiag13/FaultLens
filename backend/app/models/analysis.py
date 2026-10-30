from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ConfidenceFactor(BaseModel):
    score: float
    maxScore: float
    description: str


class ConfidenceBreakdown(BaseModel):
    faultInjectionConfirmed: ConfidenceFactor
    topologicalCoherence: ConfidenceFactor
    temporalPrecedence: ConfidenceFactor
    telemetrySignatureMatch: ConfidenceFactor
    controlGroupIsolation: ConfidenceFactor
    totalScore: float


class EvidenceItem(BaseModel):
    id: str
    title: str
    description: str
    status: str = "verified"
    category: Optional[str] = "Topological Telemetry"


class TimelineItem(BaseModel):
    time: str
    event: str
    detail: str
    type: str  # critical, warning, info, system
    badge: str


class PropagationStep(BaseModel):
    id: str
    name: str
    role: str
    status: str
    impact: str
    level: int = 0


class DownstreamSymptom(BaseModel):
    id: str
    name: str
    level: int
    role: str
    status: str
    symptom: str
    whySymptom: str


class UnaffectedService(BaseModel):
    id: str
    name: str
    status: str = "healthy"
    reason: str


class RootCauseService(BaseModel):
    id: str
    name: str
    type: str = "Microservice"
    port: int = 8080
    protocol: str = "HTTP / REST"
    runtime: str = "Docker Container"
    containerId: str = ""
    status: str = "critical"
    role: str = "Fault Origin (Root Cause)"


class RecommendationItem(BaseModel):
    id: str
    title: str
    category: str
    priority: str
    targetService: str
    description: str
    actionCode: Optional[str] = None


class RootCauseResponse(BaseModel):
    experimentId: str
    applicationId: str
    applicationName: str
    targetService: str
    targetServiceId: str
    targetServiceName: str
    probableRootCause: str
    faultType: str
    severity: str
    confidence: str
    confidenceScore: float
    confidenceLevel: str
    confidenceBreakdown: Dict[str, Any]
    summary: str
    whyExplanation: str
    topologicalDistance: str
    latencyLag: str
    temporalCorrelation: str
    blastRadiusConfinement: str
    rootCauseService: RootCauseService
    downstreamSymptoms: List[DownstreamSymptom] = []
    unaffectedServices: List[UnaffectedService] = []
    propagationPath: List[PropagationStep] = []
    evidence: List[EvidenceItem] = []
    timeline: List[TimelineItem] = []
    recommendations: List[RecommendationItem] = []

