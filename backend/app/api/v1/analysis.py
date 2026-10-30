from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.models.analysis import RootCauseResponse
from app.services.rca_engine import generate_root_cause_analysis
from app.services.store import store_instance

router = APIRouter(
    prefix="/api/v1/analysis",
    tags=["Analysis"]
)


@router.get(
    "/{experiment_id}/root-cause",
    response_model=RootCauseResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Root Cause Analysis for a specific experiment",
    description="Evaluates failure origin, failure propagation DAG, telemetry correlations, explainable confidence score, and actionable recommendations.",
)
async def get_root_cause_analysis(experiment_id: str):
    """
    Dynamically performs Root Cause Analysis for the given experiment_id:
    - Identifies original fault-injected service.
    - Analyzes dependency topology and failure propagation.
    - Correlates logs, timestamps, events, and telemetry.
    - Distinguishes root causes from downstream symptoms.
    - Calculates explainable multi-signal confidence scores.
    - Generates evidence-backed findings and recommendations.
    """
    return generate_root_cause_analysis(experiment_id)


@router.get(
    "/root-cause",
    response_model=RootCauseResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Root Cause Analysis (Query or Most Recent fallback)",
)
async def get_root_cause_analysis_query(experiment_id: Optional[str] = Query(None, description="Optional experiment ID")):
    """
    Fallback endpoint allowing RCA query by query param, or resolving to the
    most recent experiment if no experiment_id is specified.
    """
    if experiment_id:
        return generate_root_cause_analysis(experiment_id)

    # If no experiment_id specified, pick the most recent experiment from the store
    if store_instance.experiments:
        recent_id = store_instance.experiments[0].get("id")
        if recent_id:
            return generate_root_cause_analysis(recent_id)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No experiments found in the system to analyze"
    )


# Alias router for /api/analysis/... endpoints
alias_router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"]
)

alias_router.add_api_route(
    "/{experiment_id}/root-cause",
    get_root_cause_analysis,
    methods=["GET"],
    response_model=RootCauseResponse,
    include_in_schema=False,
)
alias_router.add_api_route(
    "/root-cause",
    get_root_cause_analysis_query,
    methods=["GET"],
    response_model=RootCauseResponse,
    include_in_schema=False,
)

