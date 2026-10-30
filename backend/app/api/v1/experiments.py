
from datetime import datetime
from uuid import uuid4
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.store import store_instance
from app.api.v1.docker_faults import (
    execute_demo_frontend_fault,
    recover_demo_frontend,
    execute_demo_backend_fault,
    recover_demo_backend,
    execute_demo_database_fault,
    recover_demo_database,
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
            payload.targetServiceId not in {"frontend", "backend", "database"}
            or payload.faultType != "Service Failure"
        )
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Actual fault injection currently supports only "
                "Service Failure on the Demo app Frontend ,Backend, and Database."
            )
        )

    
    docker_fault_executed = False

    if (
        payload.applicationId == DEMO_APPLICATION_ID
        and payload.faultType == "Service Failure"
    ):
        try:
            if payload.targetServiceId == "frontend":
                execute_demo_frontend_fault(payload.faultType)
                docker_fault_executed = True

            elif payload.targetServiceId == "backend":
                execute_demo_backend_fault(payload.faultType)
                docker_fault_executed = True

            elif payload.targetServiceId == "database":
                execute_demo_database_fault(payload.faultType)
                docker_fault_executed = True
        except Exception as e:
            print(f"Notice: Docker container command not executed ({e})")
            docker_fault_executed = False

    now = datetime.now().astimezone().isoformat()

    # Calculate actual topological affected services
    affected_services, level_map = store_instance.compute_affected_services(
        payload.applicationId,
        payload.targetServiceId
    )

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
        "result": f"Fault injected into {target_service.get('name', 'Service')}; blast radius active",
        "confidence": "Evaluated (Active Topology)",
        "date": "Just now",
        "timestamp": now,
        "description": payload.description or "",
        "environment": "Docker Compose (Isolated)",
        "dockerFaultExecuted": docker_fault_executed,
        "affectedServices": affected_services,
        "levelMap": level_map,
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

    target_name = experiment.get("targetServiceName", "Target Service")
    fault_type = experiment.get("faultType", "Service Failure")
    timestamp = experiment.get("timestamp", "Just now")
    affected = experiment.get("affectedServices", [])
    status = experiment.get("status", "Running")

    timeline = [
        {
            "time": "T+00s",
            "event": f"Controlled Fault Injected ({fault_type})",
            "detail": f"Target service {target_name} injected with synthetic failure in isolated environment.",
            "type": "critical",
            "badge": "INJECTED"
        },
        {
            "time": "T+01s",
            "event": f"{target_name} Health Probe Timeout",
            "detail": f"Ingress socket connection refused on {target_name}. Service node marked FAILED in red.",
            "type": "critical",
            "badge": "FAILED"
        }
    ]

    for idx, aff_id in enumerate(affected, start=1):
        timeline.append({
            "time": f"T+{idx * 2:02d}s",
            "event": f"Cascading Delays Propagated to {aff_id.replace('-', ' ').title()}",
            "detail": f"Synchronous caller {aff_id} experienced latency surge and socket timeout waiting on downstream dependency.",
            "type": "warning",
            "badge": "DEGRADED"
        })

    if status in {"Recovered", "Completed", "Stopped"}:
        timeline.append({
            "time": "Window End",
            "event": "Teardown & Recovery Completed",
            "detail": f"Teardown executed for {target_name}. Microservices recovered; final blast radius impact preserved on dependency graph.",
            "type": "info",
            "badge": "RECOVERED"
        })

    return timeline


@router.post("/{experiment_id}/stop")
async def stop_experiment(experiment_id: str):
    for experiment in store_instance.experiments:
        if experiment.get("id") == experiment_id:
            if experiment.get("status") == "Running":
                if experiment.get("dockerFaultExecuted"):
                    try:
                        if experiment.get("targetServiceId") == "frontend":
                            recover_demo_frontend()
                        elif experiment.get("targetServiceId") == "backend":
                            recover_demo_backend()
                        elif experiment.get("targetServiceId") == "database":
                            recover_demo_database()
                    except Exception as e:
                        print(f"Notice: Docker recovery not executed ({e})")

                experiment["status"] = "Recovered"
                experiment["result"] = "Stopped by Operator; target service recovered"
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
                    try:
                        if experiment.get("targetServiceId") == "frontend":
                            recover_demo_frontend()
                        elif experiment.get("targetServiceId") == "backend":
                            recover_demo_backend()
                        elif experiment.get("targetServiceId") == "database":
                            recover_demo_database()
                    except Exception as e:
                        print(f"Notice: Docker recovery not executed ({e})")

                experiment["status"] = "Recovered"
                experiment["elapsed"] = experiment.get("duration", 60)
                experiment["result"] = (
                    "Experiment window ended; recovery completed successfully"
                    if experiment.get("dockerFaultExecuted")
                    else "Experiment window ended; service recovered and final impact preserved"
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