Create the initial **FaultLens** project:

# FaultLens

### Graph-Driven Continuous Resilience Simulator & Auto-Remediation Patch Generator

We are building this as a research/college project. This is **Phase 1: Local Resilience Simulation Prototype**.

The goal of this phase is NOT to build the complete system.

We want to prove one core concept:

> Represent a distributed system as a dependency graph → inject a fault into one service → calculate how the failure propagates through dependent services → visualize the resulting system state in React.

---

# 1. Technology Stack

### Backend

* Python
* FastAPI
* NetworkX
* Pydantic
* pytest

### Frontend

* React
* Vite
* React Flow for dependency-graph visualization
* Axios for API communication

### Explicitly DO NOT use yet

* Docker
* Kubernetes
* PostgreSQL
* Redis
* OpenTelemetry
* ML models
* LLMs
* Gemini/OpenAI APIs
* Authentication
* Cloud services
* Real microservices
* Complex monitoring infrastructure

Everything must run locally.

---

# 2. Project Structure

Create:

```text
faultlens/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── service.py
│   │   │   └── system.py
│   │   │
│   │   ├── graph/
│   │   │   ├── __init__.py
│   │   │   └── dependency_graph.py
│   │   │
│   │   ├── simulation/
│   │   │   ├── __init__.py
│   │   │   ├── fault_injector.py
│   │   │   └── propagation.py
│   │   │
│   │   └── api/
│   │       ├── __init__.py
│   │       └── routes.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_graph.py
│   │   ├── test_fault_injection.py
│   │   └── test_propagation.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SystemGraph.jsx
│   │   │   ├── ServiceNode.jsx
│   │   │   └── FaultControls.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── experiments/
│   └── README.md
│
├── README.md
└── .gitignore
```

Keep backend and frontend completely separated.

---

# 3. Simulated Distributed System

Create a small simulated system containing approximately 6 services:

```text
                    Gateway
                       │
                       ▼
                     Auth
                       │
                       ▼
                     Order
                    /     \
                   ▼       ▼
              Payment   Inventory
                   \       /
                    ▼     ▼
                     Database
```

Represent the dependencies using NetworkX.

IMPORTANT:

Define the meaning of an edge clearly:

```text
A → B
```

means:

> A depends on B.

Therefore if B fails, A may be affected.

Do not reverse this convention anywhere in the project.

---

# 4. Service Model

Each service should contain at least:

```text
id
name
status
```

Possible statuses:

```text
HEALTHY
DEGRADED
FAILED
```

Keep the model extensible for future statuses.

---

# 5. Dependency Model

Dependencies should contain:

```text
source
target
critical
```

Example:

```text
Order → Payment
critical = true
```

Meaning:

> Order depends critically on Payment.

Another dependency could be non-critical.

Do NOT hard-code propagation behavior specifically for "Payment" or "Order".

The propagation engine must work from the graph and dependency metadata.

---

# 6. Fault Injection

Initially implement only:

```text
SERVICE_DOWN
```

The backend should expose an API similar to:

```text
POST /api/faults/inject
```

Request:

```json
{
  "service_id": "payment",
  "fault_type": "SERVICE_DOWN"
}
```

This should:

1. Find the service.
2. Mark it as FAILED.
3. Run the propagation engine.
4. Update affected services.
5. Return the updated system state.

Later we will add:

```text
LATENCY
TIMEOUT
ERROR_RATE
CPU_SPIKE
NETWORK_FAILURE
```

but DO NOT implement them now.

---

# 7. Failure Propagation

This is the most important part of Phase 1.

Suppose:

```text
Gateway → Auth
Auth → Order
Order → Payment
Payment → Database
```

If Payment fails:

```text
Payment = FAILED
```

Then services depending on Payment should become affected.

For a critical dependency:

```text
dependent → FAILED
```

For a non-critical dependency:

```text
dependent → DEGRADED
```

Example:

```text
Order
  |
  | critical dependency
  ▼
Payment = FAILED

Therefore:

Order = FAILED
```

But:

```text
Order
  |
  | non-critical dependency
  ▼
Inventory = FAILED

Therefore:

Order = DEGRADED
```

The propagation engine must traverse the dependency graph rather than using manually written cases.

Write unit tests for:

### Chain

```text
A → B → C
```

If B fails:

```text
B = FAILED
A = affected
C = HEALTHY
```

### Branch

```text
A → B
A → C
```

If B fails:

```text
B = FAILED
A = affected
C = HEALTHY
```

---

# 8. Backend API

Initially implement:

```text
GET  /api/system
POST /api/faults/inject
POST /api/system/reset
```

### GET /api/system

Return:

* services
* service statuses
* dependencies
* graph information

Example:

```json
{
  "services": [
    {
      "id": "payment",
      "name": "Payment Service",
      "status": "HEALTHY"
    }
  ],
  "dependencies": [
    {
      "source": "order",
      "target": "payment",
      "critical": true
    }
  ]
}
```

### POST /api/system/reset

Reset every service to:

```text
HEALTHY
```

---

# 9. React Frontend

Create a very simple dashboard.

Do NOT spend time making it visually fancy.

The important thing is functionality.

The page should contain:

### Header

```text
FaultLens
Graph-Driven Resilience Simulator
```

### System Graph

Use **React Flow**.

Display all services as nodes and dependencies as edges.

Node appearance should clearly communicate:

```text
HEALTHY
DEGRADED
FAILED
```

When a service changes status, its node should update immediately.

### Fault Controls

Create:

```text
Service:
[ Payment Service ▼ ]

Fault:
[ SERVICE_DOWN ▼ ]

[ Inject Fault ]
```

Also:

```text
[ Reset System ]
```

---

# 10. User Flow

The complete flow should be:

```text
User opens React app
        ↓
React calls GET /api/system
        ↓
Backend returns graph
        ↓
React Flow renders system
        ↓
User selects Payment Service
        ↓
User clicks "Inject Fault"
        ↓
React POSTs /api/faults/inject
        ↓
Backend marks Payment FAILED
        ↓
Propagation Engine runs
        ↓
Affected services change status
        ↓
Backend returns updated state
        ↓
React updates graph
```

This separation is important.

The React UI must NOT contain the resilience/propagation logic.

The backend must own the simulation.

---

# 11. Visual Example

Initial graph:

```text
       [Gateway]
           │
         [Auth]
           │
         [Order]
        /      \
   [Payment] [Inventory]
        \       /
        [Database]
```

All services:

```text
HEALTHY
```

After:

```text
Inject SERVICE_DOWN → Payment
```

Expected behavior:

```text
Payment       FAILED
Order         FAILED/DEGRADED depending on criticality
Gateway       potentially affected through Order
Auth          potentially affected through Order
Inventory     HEALTHY
Database      HEALTHY
```

Do not hard-code this exact result. It must be calculated by the dependency graph.

---

# 12. Tests

Use pytest.

At minimum test:

### Graph

* adding services
* adding dependencies
* retrieving dependencies
* retrieving dependents

### Fault injection

```text
healthy service
        ↓
SERVICE_DOWN
        ↓
FAILED
```

### Propagation

Test chain and branching graphs.

### Reset

After reset:

```text
all services = HEALTHY
```

---

# 13. CORS

Configure FastAPI CORS so the local React frontend can communicate with the backend during development.

Expected local setup:

```text
React:
http://localhost:5173

FastAPI:
http://localhost:8000
```

---

# 14. README

Create a useful README containing:

1. Project overview
2. Current Phase 1 scope
3. Architecture diagram using Markdown
4. Folder structure
5. Backend setup
6. Frontend setup
7. How to run backend
8. How to run frontend
9. How to run tests
10. Example fault-injection scenario
11. Current limitations
12. Planned future phases

---

# 15. Future Architecture Awareness

Structure the code so future components can eventually be added:

```text
                    FaultLens
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Dependency       Fault          Monitoring
   Graph        Simulation       /Telemetry
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  RCA Engine
                       │
                       ▼
              Remediation Engine
                       │
                       ▼
               Patch Generator
                       │
                       ▼
             Human Validation
```

But DO NOT implement these future components now.

---

# 16. Coding Principles

* Keep functions small.
* Use clear names.
* Use Pydantic models for API request/response models.
* Keep graph logic independent from FastAPI.
* Keep simulation logic independent from React.
* Avoid unnecessary abstractions.
* Avoid over-engineering.
* Add comments only where they explain non-obvious logic.
* Do not generate placeholder files containing meaningless code.
* Make the prototype actually runnable.

Before finishing, verify that:

```text
Backend starts successfully.
Frontend starts successfully.
React can communicate with FastAPI.
Graph renders.
Fault injection works.
Failure propagation works.
Reset works.
pytest tests pass.
```

At the end, show me:

1. Final folder structure
2. Important architectural decisions
3. Commands to run backend/frontend/tests
4. Example API requests
5. Any assumptions you made
6. Any issues encountered
7. What should be implemented in Phase 2

Do NOT add Docker or any infrastructure complexity unless explicitly requested later.
