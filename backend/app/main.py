from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.applications import router as applications_router

app = FastAPI(
    title="FaultLens Backend API",
    description="Microservice Resilience Testing & Automated Root-Cause Analysis Platform API",
    version="1.0.0",
)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(applications_router)
app.include_router(applications_router, prefix="/api")  # Alias for /api/applications

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "FaultLens API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
