# FaultLens Experiments - Phase 1

This directory contains test scenarios and notes for Phase 1 prototype resilience experiments.

## Core Scenarios Tested

### 1. Primary Database Outage (Cascading Downstream Failure)
- **Injection Point**: `database` -> `SERVICE_DOWN`
- **Expected Outcome**:
  - `database`: FAILED
  - `payment`: FAILED (critical dependency on `database`)
  - `inventory`: FAILED (critical dependency on `database`)
  - `order`: FAILED (critical dependency on `payment`)
  - `auth`: FAILED (critical dependency on `order`)
  - `gateway`: FAILED (critical dependency on `auth`)

### 2. Payment Service Outage (Partial Cascade)
- **Injection Point**: `payment` -> `SERVICE_DOWN`
- **Expected Outcome**:
  - `payment`: FAILED
  - `order`: FAILED (critical dependency on `payment`)
  - `auth`: FAILED (critical dependency on `order`)
  - `gateway`: FAILED (critical dependency on `auth`)
  - `inventory`: HEALTHY
  - `database`: HEALTHY

### 3. Inventory Service Outage (Degraded State)
- **Injection Point**: `inventory` -> `SERVICE_DOWN`
- **Expected Outcome**:
  - `inventory`: FAILED
  - `order`: DEGRADED (non-critical dependency on `inventory`)
  - `auth`: DEGRADED (critical dependency on DEGRADED `order`)
  - `gateway`: DEGRADED (critical dependency on DEGRADED `auth`)
  - `payment`: HEALTHY
  - `database`: HEALTHY
