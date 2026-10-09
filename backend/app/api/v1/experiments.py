
from datetime import datetime
from uuid import uuid4
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.store import store_instance
from app.api.v1.docker_faults import (
    execute_demo_frontend_fault,
    recover_demo_frontend,
)

DEMO_APPLICATION_ID = "app-1a1204bcde7"
DEMO_FRONTEND_SERVICE_ID = "frontend"


router = APIRouter(
    prefix="/api/v1/experiments",
    tags=["Experiments"]
)


class ExperimentCreate(BaseModel):
    name: Optional[str] = None
    applicationId: str
    applicationName: Optional[str] = None
    targetServiceId: str
    targetServiceName: Optional[str] = None
    faultType: str
    severity: str = "High"
    duration: int = 60
    description: Optional[str] = None


@router.get("")
async def get_experiments(application_id: Optional[str] = None):
    experiments = store_instance.experiments

    if application_id:
        experiments = [
            exp for exp in experiments
            if exp.get("applicationId") == application_id
        ]

    return experiments


@router.get("/{experiment_id}")
async def get_experiment(experiment_id: str):
    for experiment in store_instance.experiments:
        if experiment.get("id") == experiment_id:
            return experiment

    raise HTTPException(
        status_code=404,
        detail="Experiment not found"
    )


@router.post("", status_code=201)
async def create_experiment(payload: ExperimentCreate):
    application = store_instance.get_application_by_id(
        payload.applicationId
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    services = store_instance.get_services(payload.applicationId)

    target_service = next(
        (
            service for service in services
            if service.get("id") == payload.targetServiceId
        ),
        None
    )

    if not target_service:
        raise HTTPException(
            status_code=404,
            detail="Target service not found in this application"
        )

    if (
        payload.applicationId == DEMO_APPLICATION_ID
        and (
            payload.targetServiceId != DEMO_FRONTEND_SERVICE_ID
            or payload.faultType != "Service Failure"
        )
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Actual fault injection currently supports only "
                "Service Failure on the Demo app Frontend."
            )
        )

    docker_fault_executed = False

    if (
        payload.applicationId == DEMO_APPLICATION_ID
        and payload.targetServiceId == DEMO_FRONTEND_SERVICE_ID
        and payload.faultType == "Service Failure"
    ):
        execute_demo_frontend_fault(payload.faultType)
        docker_fault_executed = True

    now = datetime.now().astimezone().isoformat()

    experiment = {
        "id": f"exp-{uuid4().hex[:12]}",
        "name": payload.name or (
            f"{payload.targetServiceName or target_service.get('name', 'Service')} "
            f"{payload.faultType} Test"
        ),
        "applicationId": payload.applicationId,
        "applicationName": (
            payload.applicationName or application.get("name", "Application")
        ),
        "targetServiceId": payload.targetServiceId,
        "targetServiceName": (
            payload.targetServiceName or target_service.get("name", "Service")
        ),
        "faultType": payload.faultType,
        "severity": payload.severity,
        "duration": max(1, payload.duration),
        "elapsed": 0,
        "status": "Running",
        "result": "Experiment record created; fault execution not implemented",
        "confidence": "Not evaluated",
        "date": "Just now",
        "timestamp": now,
        "description": payload.description or "",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": docker_fault_executed,
    }

    store_instance.experiments.insert(0, experiment)
    store_instance._save_to_disk()

    return experiment


@router.get("/{experiment_id}/timeline")
async def get_experiment_timeline(experiment_id: str):
    experiment = next(
        (
            exp for exp in store_instance.experiments
            if exp.get("id") == experiment_id
        ),
        None
    )

    if not experiment:
        raise HTTPException(
            status_code=404,
            detail="Experiment not found"
        )

    return [
        {
            "time": experiment.get("timestamp"),
            "event": "Experiment record created",
            "detail": (
                "Configuration saved successfully. "
                "Actual fault injection and telemetry collection "
                "are not implemented yet."
            ),
            "type": "info",
            "badge": "RECORDED"
        }
    ]


@router.post("/{experiment_id}/stop")
async def stop_experiment(experiment_id: str):
    for experiment in store_instance.experiments:
        if experiment.get("id") == experiment_id:
            if experiment.get("status") == "Running":
                if experiment.get("dockerFaultExecuted"):
                    recover_demo_frontend()
                experiment["status"] = "Completed"
                experiment["result"] = "Stopped by Operator"
                experiment["timestampUpdated"] = (
                    datetime.now().astimezone().isoformat()
                )

                store_instance._save_to_disk()

            return experiment

    raise HTTPException(
        status_code=404,
        detail="Experiment not found"
    )


@router.post("/{experiment_id}/complete")
async def complete_experiment(experiment_id: str):
    for experiment in store_instance.experiments:
        if experiment.get("id") == experiment_id:
            if experiment.get("status") == "Running":
                if experiment.get("dockerFaultExecuted"):
                    recover_demo_frontend()
                experiment["status"] = "Completed"
                experiment["elapsed"] = experiment.get("duration", 60)
                experiment["result"] = (
                    "Experiment window ended; demo frontend recovery completed"
                    if experiment.get("dockerFaultExecuted")
                    else "Experiment window ended; no actual fault was executed"
                )
                experiment["timestampUpdated"] = (
                    datetime.now().astimezone().isoformat()
                )
                store_instance._save_to_disk()

            return experiment

    raise HTTPException(
        status_code=404,
        detail="Experiment not found"
    )