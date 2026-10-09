
import subprocess
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/api/v1/docker-faults",
    tags=["Docker Fault Injection"]
)

PROJECT_ROOT = Path(__file__).resolve().parents[4]
COMPOSE_FILE = PROJECT_ROOT / "faultlens-demo-compose.yml"
PROJECT_NAME = "faultlens-demo"

ALLOWED_SERVICES = {"frontend"}


def run_compose(service: str, action: str):
    if service not in ALLOWED_SERVICES:
        raise HTTPException(
            status_code=400,
            detail="Only the demo frontend service is allowed."
        )

    if not COMPOSE_FILE.is_file():
        raise HTTPException(
            status_code=500,
            detail="Demo Docker Compose file was not found."
        )

    if action not in {"stop", "start"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported action."
        )

    command = [
        "docker", "compose",
        "-p", PROJECT_NAME,
        "-f", str(COMPOSE_FILE),
        action, service
    ]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=30,
            check=False
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Docker command timed out."
        )
    except OSError:
        raise HTTPException(
            status_code=500,
            detail="Could not run Docker. Check Docker Desktop."
        )

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=result.stderr.strip() or "Docker command failed."
        )

    return {
        "project": PROJECT_NAME,
        "service": service,
        "action": action,
        "output": result.stdout.strip(),
        "message": f"Demo {service} {action} command completed."
    }


def execute_demo_frontend_fault(fault_type: str):
    if fault_type != "Service Failure":
        raise HTTPException(
            status_code=400,
            detail=(
                "Currently only Service Failure is supported "
                "for the demo frontend."
            )
        )

    return run_compose("frontend", "stop")


def recover_demo_frontend():
    return run_compose("frontend", "start")


@router.post("/frontend/stop")
async def stop_demo_frontend():
    return run_compose("frontend", "stop")


@router.post("/frontend/start")
async def start_demo_frontend():
    return run_compose("frontend", "start")