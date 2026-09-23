from typing import List
from pydantic import BaseModel, Field
from app.models.service import Service, Dependency


class SystemStateResponse(BaseModel):
    services: List[Service] = Field(default_factory=list, description="List of all system services")
    dependencies: List[Dependency] = Field(default_factory=list, description="List of all service dependencies")
