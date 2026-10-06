export const MOCK_APPLICATIONS = [
  {
    id: 'app-ecommerce',
    name: 'E-Commerce Platform',
    status: 'Operational with warnings',
    statusType: 'warning',
    description: 'Distributed microservices architecture powering checkout, cart, payment processing, and inventory catalog in an isolated Docker sandbox.',
    environment: 'Docker Compose (Isolated Sandbox)',
    isolation: 'Strict Container Isolation Enabled',
    servicesCount: 8,
    dependenciesCount: 11,
    experimentsCount: 12,
    activeIssues: 1,
    lastExperiment: {
      name: 'Payment Service Failure Simulation',
      status: 'Completed',
      result: 'Impact Detected',
      time: '2 hours ago',
    },
    lastUpdated: '10 minutes ago',
    repository: 'github.com/engineering/ecommerce-core',
    composeFile: 'docker-compose.resilience.yml',
  },
  {
    id: 'app-crm',
    name: 'CRM & Billing Suite',
    status: 'Operational',
    statusType: 'healthy',
    description: 'Customer relations and automated billing dispatch platform running containerized worker queues and relational databases.',
    environment: 'Docker Compose (Isolated Sandbox)',
    isolation: 'Strict Container Isolation Enabled',
    servicesCount: 6,
    dependenciesCount: 7,
    experimentsCount: 4,
    activeIssues: 0,
    lastExperiment: {
      name: 'Billing DB Replica Timeout',
      status: 'Completed',
      result: 'Resilient (Auto-failover OK)',
      time: 'Yesterday',
    },
    lastUpdated: '1 day ago',
    repository: 'github.com/engineering/crm-billing',
    composeFile: 'docker-compose.sandbox.yml',
  },
  {
    id: 'app-streaming',
    name: 'Real-time Event Ingestion',
    status: 'Operational',
    statusType: 'healthy',
    description: 'High-throughput Kafka and consumer worker cluster validating event streaming resilience under broker network partition.',
    environment: 'Docker Compose (Isolated Sandbox)',
    isolation: 'Strict Container Isolation Enabled',
    servicesCount: 5,
    dependenciesCount: 6,
    experimentsCount: 8,
    activeIssues: 0,
    lastExperiment: {
      name: 'Kafka Broker 2 Network Drop',
      status: 'Completed',
      result: 'Partition Handled',
      time: '3 days ago',
    },
    lastUpdated: '3 days ago',
    repository: 'github.com/engineering/event-pipeline',
    composeFile: 'docker-compose.cluster.yml',
  }
];

export const MOCK_SERVICES = {
  'app-ecommerce': [
    {
      id: 'api-gateway',
      name: 'API Gateway',
      type: 'Gateway',
      status: 'degraded',
      statusLabel: 'Degraded (High Latency)',
      port: 8080,
      protocol: 'HTTP/2 / REST',
      cpu: '46%',
      memory: '54%',
      responseTime: '420ms',
      baselineResponseTime: '38ms',
      errorRate: '12.4%',
      baselineErrorRate: '0.02%',
      requestRate: '1,420 req/s',
      dependencies: ['auth-service', 'order-service', 'catalog-service'],
      dependents: ['external-clients'],
      description: 'Public ingress reverse-proxy routing client requests with rate limiting and TLS termination.',
      runtime: 'Envoy / Go 1.22',
      containerId: 'cnt_gateway_90a',
    },
    {
      id: 'auth-service',
      name: 'Auth Service',
      type: 'Microservice',
      status: 'healthy',
      statusLabel: 'Healthy',
      port: 8081,
      protocol: 'gRPC / JSON',
      cpu: '18%',
      memory: '28%',
      responseTime: '19ms',
      baselineResponseTime: '18ms',
      errorRate: '0.0%',
      baselineErrorRate: '0.0%',
      requestRate: '340 req/s',
      dependencies: ['postgres-db'],
      dependents: ['api-gateway'],
      description: 'Handles JWT verification, session caching, and RBAC token rotation.',
      runtime: 'Node.js 20 LTS',
      containerId: 'cnt_auth_88c',
    },
    {
      id: 'order-service',
      name: 'Order Service',
      type: 'Microservice',
      status: 'degraded',
      statusLabel: 'Degraded (Cascading Delays)',
      port: 8082,
      protocol: 'REST / Internal',
      cpu: '64%',
      memory: '71%',
      responseTime: '1,480ms',
      baselineResponseTime: '65ms',
      errorRate: '18.6%',
      baselineErrorRate: '0.05%',
      requestRate: '410 req/s',
      dependencies: ['payment-service', 'inventory-service', 'notification-service', 'postgres-db'],
      dependents: ['api-gateway'],
      description: 'Coordinates cart checkout, order validation, and transaction orchestrations.',
      runtime: 'Python 3.11 / FastAPI',
      containerId: 'cnt_order_44b',
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      type: 'Microservice',
      status: 'critical',
      statusLabel: 'FAILED (Active Experiment Target)',
      port: 8083,
      protocol: 'HTTPS / Internal',
      cpu: '72%',
      memory: '78%',
      responseTime: '3,200ms',
      baselineResponseTime: '110ms',
      errorRate: '34.8%',
      baselineErrorRate: '0.1%',
      requestRate: '88 req/s',
      dependencies: ['postgres-db'],
      dependents: ['order-service'],
      description: 'Manages third-party payment tokens, gateway routing, and ledger authorization.',
      runtime: 'Go 1.22 / Gin',
      containerId: 'cnt_payment_01f',
    },
    {
      id: 'inventory-service',
      name: 'Inventory Service',
      type: 'Microservice',
      status: 'healthy',
      statusLabel: 'Healthy',
      port: 8084,
      protocol: 'gRPC',
      cpu: '24%',
      memory: '36%',
      responseTime: '26ms',
      baselineResponseTime: '24ms',
      errorRate: '0.1%',
      baselineErrorRate: '0.05%',
      requestRate: '280 req/s',
      dependencies: ['postgres-db'],
      dependents: ['order-service'],
      description: 'Real-time stock deduction, SKU warehouse reservation, and item lock management.',
      runtime: 'Rust / Actix',
      containerId: 'cnt_inventory_33d',
    },
    {
      id: 'catalog-service',
      name: 'Product Catalog',
      type: 'Microservice',
      status: 'healthy',
      statusLabel: 'Healthy',
      port: 8085,
      protocol: 'REST',
      cpu: '16%',
      memory: '32%',
      responseTime: '15ms',
      baselineResponseTime: '15ms',
      errorRate: '0.0%',
      baselineErrorRate: '0.0%',
      requestRate: '890 req/s',
      dependencies: ['postgres-db'],
      dependents: ['api-gateway'],
      description: 'Read-heavy product search, category browsing, and pricing catalog.',
      runtime: 'Go 1.22',
      containerId: 'cnt_catalog_12x',
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      type: 'Worker',
      status: 'healthy',
      statusLabel: 'Healthy',
      port: 8086,
      protocol: 'Async Worker',
      cpu: '14%',
      memory: '22%',
      responseTime: '48ms',
      baselineResponseTime: '45ms',
      errorRate: '0.0%',
      baselineErrorRate: '0.0%',
      requestRate: '120 msg/s',
      dependencies: ['postgres-db'],
      dependents: ['order-service'],
      description: 'Asynchronous transactional email, SMS receipt, and push notification dispatcher.',
      runtime: 'Node.js 20 LTS',
      containerId: 'cnt_notif_77e',
    },
    {
      id: 'postgres-db',
      name: 'Database (PostgreSQL)',
      type: 'Database',
      status: 'healthy',
      statusLabel: 'Healthy',
      port: 5432,
      protocol: 'PostgreSQL 16',
      cpu: '38%',
      memory: '62%',
      responseTime: '7ms',
      baselineResponseTime: '6ms',
      errorRate: '0.0%',
      baselineErrorRate: '0.0%',
      requestRate: '1,850 qps',
      dependencies: [],
      dependents: ['order-service', 'payment-service', 'inventory-service', 'catalog-service', 'auth-service', 'notification-service'],
      description: 'Primary relational database storing transactional orders, users, and audit records.',
      runtime: 'PostgreSQL 16.2 Alpine',
      containerId: 'cnt_postgres_db',
    }
  ]
};

export const MOCK_GRAPH_NODES = [
  {
    id: 'api-gateway',
    type: 'serviceNode',
    position: { x: 380, y: 30 },
    data: {
      label: 'API Gateway',
      serviceType: 'Gateway',
      status: 'degraded',
      port: 8080,
      responseTime: '420ms',
      errorRate: '12.4%',
      isTarget: false,
      isAffected: true,
    }
  },
  {
    id: 'auth-service',
    type: 'serviceNode',
    position: { x: 120, y: 170 },
    data: {
      label: 'Auth Service',
      serviceType: 'Microservice',
      status: 'healthy',
      port: 8081,
      responseTime: '19ms',
      errorRate: '0.0%',
      isTarget: false,
      isAffected: false,
    }
  },
  {
    id: 'catalog-service',
    type: 'serviceNode',
    position: { x: 640, y: 170 },
    data: {
      label: 'Product Catalog',
      serviceType: 'Microservice',
      status: 'healthy',
      port: 8085,
      responseTime: '15ms',
      errorRate: '0.0%',
      isTarget: false,
      isAffected: false,
    }
  },
  {
    id: 'order-service',
    type: 'serviceNode',
    position: { x: 380, y: 170 },
    data: {
      label: 'Order Service',
      serviceType: 'Microservice',
      status: 'degraded',
      port: 8082,
      responseTime: '1,480ms',
      errorRate: '18.6%',
      isTarget: false,
      isAffected: true,
    }
  },
  {
    id: 'payment-service',
    type: 'serviceNode',
    position: { x: 220, y: 320 },
    data: {
      label: 'Payment Service',
      serviceType: 'Microservice',
      status: 'critical',
      port: 8083,
      responseTime: '3,200ms',
      errorRate: '34.8%',
      isTarget: true,
      isAffected: true,
    }
  },
  {
    id: 'inventory-service',
    type: 'serviceNode',
    position: { x: 440, y: 320 },
    data: {
      label: 'Inventory Service',
      serviceType: 'Microservice',
      status: 'healthy',
      port: 8084,
      responseTime: '26ms',
      errorRate: '0.1%',
      isTarget: false,
      isAffected: false,
    }
  },
  {
    id: 'notification-service',
    type: 'serviceNode',
    position: { x: 660, y: 320 },
    data: {
      label: 'Notification Service',
      serviceType: 'Worker',
      status: 'healthy',
      port: 8086,
      responseTime: '48ms',
      errorRate: '0.0%',
      isTarget: false,
      isAffected: false,
    }
  },
  {
    id: 'postgres-db',
    type: 'serviceNode',
    position: { x: 380, y: 470 },
    data: {
      label: 'Database (Postgres)',
      serviceType: 'Database',
      status: 'healthy',
      port: 5432,
      responseTime: '7ms',
      errorRate: '0.0%',
      isTarget: false,
      isAffected: false,
    }
  }
];

export const MOCK_GRAPH_EDGES = [
  {
    id: 'e-gw-auth',
    source: 'api-gateway',
    target: 'auth-service',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 1.5 },
  },
  {
    id: 'e-gw-catalog',
    source: 'api-gateway',
    target: 'catalog-service',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 1.5 },
  },
  {
    id: 'e-gw-order',
    source: 'api-gateway',
    target: 'order-service',
    animated: true,
    className: 'edge-degraded-flow',
    style: { stroke: '#D97706', strokeWidth: 2 },
  },
  {
    id: 'e-order-payment',
    source: 'order-service',
    target: 'payment-service',
    animated: true,
    className: 'edge-critical-flow',
    style: { stroke: '#DC2626', strokeWidth: 2.5 },
  },
  {
    id: 'e-order-inv',
    source: 'order-service',
    target: 'inventory-service',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 1.5 },
  },
  {
    id: 'e-order-notif',
    source: 'order-service',
    target: 'notification-service',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 1.5 },
  },
  {
    id: 'e-auth-db',
    source: 'auth-service',
    target: 'postgres-db',
    animated: false,
    style: { stroke: '#1E293B', strokeWidth: 1 },
  },
  {
    id: 'e-payment-db',
    source: 'payment-service',
    target: 'postgres-db',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 1.5 },
  },
  {
    id: 'e-inv-db',
    source: 'inventory-service',
    target: 'postgres-db',
    animated: false,
    style: { stroke: '#1E293B', strokeWidth: 1 },
  },
  {
    id: 'e-catalog-db',
    source: 'catalog-service',
    target: 'postgres-db',
    animated: false,
    style: { stroke: '#1E293B', strokeWidth: 1 },
  },
  {
    id: 'e-notif-db',
    source: 'notification-service',
    target: 'postgres-db',
    animated: false,
    style: { stroke: '#1E293B', strokeWidth: 1 },
  }
];

export const MOCK_EXPERIMENTS = [
  {
    id: 'exp-101',
    name: 'Payment Service Outage Simulation',
    applicationId: 'app-ecommerce',
    applicationName: 'E-Commerce Platform',
    targetServiceId: 'payment-service',
    targetServiceName: 'Payment Service',
    faultType: 'Service Failure',
    severity: 'High',
    duration: 60,
    elapsed: 60,
    status: 'Completed',
    result: 'Impact Detected',
    confidence: '94%',
    date: 'Today, 12:04 PM',
    timestamp: '2026-10-04T12:04:20Z',
    description: 'Simulate complete payment gateway service crash in isolated environment to observe checkout failure cascades.',
    environment: 'Docker Compose (Isolated)',
  },
  {
    id: 'exp-102',
    name: 'Order Service High Latency Test',
    applicationId: 'app-ecommerce',
    applicationName: 'E-Commerce Platform',
    targetServiceId: 'order-service',
    targetServiceName: 'Order Service',
    faultType: 'High Latency',
    severity: 'Medium',
    duration: 90,
    elapsed: 90,
    status: 'Completed',
    result: 'Degraded Performance',
    confidence: '88%',
    date: 'Yesterday, 16:30 PM',
    timestamp: '2026-10-03T16:30:00Z',
    description: 'Inject 1500ms jitter and network delay on order fulfillment handler.',
    environment: 'Docker Compose (Isolated)',
  },
  {
    id: 'exp-103',
    name: 'PostgreSQL Connection Exhaustion',
    applicationId: 'app-ecommerce',
    applicationName: 'E-Commerce Platform',
    targetServiceId: 'postgres-db',
    targetServiceName: 'Database (Postgres)',
    faultType: 'Database Failure',
    severity: 'Critical',
    duration: 45,
    elapsed: 45,
    status: 'Completed',
    result: 'Impact Detected',
    confidence: '96%',
    date: 'Oct 2, 2026',
    timestamp: '2026-10-02T11:15:00Z',
    description: 'Simulate max connection pool saturation to evaluate circuit breaker fallbacks.',
    environment: 'Docker Compose (Isolated)',
  },
  {
    id: 'exp-104',
    name: 'Auth Token 503 Internal Error Injection',
    applicationId: 'app-ecommerce',
    applicationName: 'E-Commerce Platform',
    targetServiceId: 'auth-service',
    targetServiceName: 'Auth Service',
    faultType: 'HTTP/API Failure',
    severity: 'Low',
    duration: 30,
    elapsed: 30,
    status: 'Completed',
    result: 'Graceful Degradation',
    confidence: '91%',
    date: 'Sep 29, 2026',
    timestamp: '2026-09-29T09:40:00Z',
    description: 'Simulate intermittent 503 Service Unavailable responses during token refresh requests.',
    environment: 'Docker Compose (Isolated)',
  }
];

export const MOCK_INCIDENT_TIMELINE = [
  {
    time: '12:04:20',
    timestamp: '2026-10-04T12:04:20Z',
    event: 'Controlled Experiment Initialized',
    type: 'system',
    badge: 'INFO',
    detail: 'FaultLens injected SIGTERM process failure into isolated container cnt_payment_01f.',
  },
  {
    time: '12:04:25',
    timestamp: '2026-10-04T12:04:25Z',
    event: 'Payment Service Health Check Failed',
    type: 'critical',
    badge: 'FAILED',
    detail: 'HTTP /health probe timed out after 3000ms. Service state marked FAILED.',
  },
  {
    time: '12:04:27',
    timestamp: '2026-10-04T12:04:27Z',
    event: 'Order Service Cascading Latency Spike',
    type: 'warning',
    badge: 'DEGRADED',
    detail: 'Order checkout requests blocked waiting for synchronous payment socket. Response time jumped from 65ms to 1,480ms.',
  },
  {
    time: '12:04:30',
    timestamp: '2026-10-04T12:04:30Z',
    event: 'API Gateway Ingress Error Rate Increased',
    type: 'warning',
    badge: 'WARN',
    detail: 'HTTP 504 Gateway Timeout errors detected on /api/v1/orders/checkout endpoint (12.4% error rate).',
  },
  {
    time: '12:04:42',
    timestamp: '2026-10-04T12:04:42Z',
    event: 'Simulated User Transactions Impacted',
    type: 'critical',
    badge: 'IMPACT',
    detail: 'Synthetic user workload experienced 348 failed transaction responses across the evaluation window.',
  },
  {
    time: '12:05:20',
    timestamp: '2026-10-04T12:05:20Z',
    event: 'Experiment Timer Expired & Teardown Triggered',
    type: 'system',
    badge: 'CLEANUP',
    detail: 'Isolated sandbox reset initiated. Telemetry data aggregated for Root Cause Analysis.',
  }
];

export const MOCK_ROOT_CAUSE = {
  experimentId: 'exp-101',
  probableRootCause: 'Payment Service Failure',
  targetService: 'payment-service',
  confidence: '94%',
  severity: 'High',
  summary: 'Fault cascade initiated by simulated crash in payment-service container. Unhandled socket timeouts in the upstream order-service propagated to the API Gateway ingress.',
  whyExplanation: 'FaultLens evaluated topological dependency distance, exact event timestamps, and telemetry signatures. The initial failure occurred at T+5s directly on payment-service. Downstream services (product-catalog, auth-service) remained completely healthy, isolating the blast radius strictly along the order-service dependency path. The temporal correlation coefficient across latency surge and error logs is 0.982.',
  evidence: [
    {
      id: 'ev-1',
      title: 'Fault injection event confirmed',
      description: 'Controlled SIGKILL injected into container cnt_payment_01f at 12:04:20.',
      status: 'verified',
    },
    {
      id: 'ev-2',
      title: 'Direct dependency relationship confirmed',
      description: 'Dependency graph validates synchronous dependency Order Service → Payment Service.',
      status: 'verified',
    },
    {
      id: 'ev-3',
      title: 'Upstream error spike detected',
      description: 'Order Service error rate surged from 0.05% to 18.6% within 2.1 seconds of fault.',
      status: 'verified',
    },
    {
      id: 'ev-4',
      title: 'Downstream non-dependent services unaffected',
      description: 'Catalog and Auth services maintained 100% availability, ruling out cluster-wide infrastructure failures.',
      status: 'verified',
    },
    {
      id: 'ev-5',
      title: 'Temporal correlation signature',
      description: 'Error propagation timeline matches synchronous HTTP socket timeout threshold (2500ms).',
      status: 'verified',
    },
    {
      id: 'ev-6',
      title: 'Service health state transition',
      description: 'Payment Service container health transition recorded from 200 OK to Connection Refused.',
      status: 'verified',
    }
  ]
};

export const MOCK_REMEDIATION = {
  experimentId: 'exp-101',
  rootCause: 'Payment Service Failure',
  targetService: 'Payment Service (Invoked by Order Service)',
  recommendedAction: 'Introduce retry handling and circuit-breaker protection around the payment dependency in the Order processing pipeline.',
  priority: 'HIGH',
  confidence: 'High (AI-Assisted Analysis)',
  reviewStatus: 'Pending Developer Review',
  rationale: 'The Order Service currently calls the Payment Service synchronously without timeout caps, retries, or circuit-breaker protection. When the Payment Service is unavailable, Order Service worker threads block until TCP timeouts elapse, exhausting worker capacity and taking down order submission for all users.',
  suggestedPatch: {
    targetFile: 'services/order/payment_client.py',
    language: 'python',
    beforeCode: `def process_order_payment(order_id: str, amount: float, user_token: str) -> dict:
    """
    Direct synchronous payment call without resilience protection.
    Throws uncaught socket exceptions on payment outage.
    """
    response = requests.post(
        f"{PAYMENT_SERVICE_URL}/v1/charges",
        json={"order_id": order_id, "amount": amount},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    return response.json()`,
    afterCode: `from circuitbreaker import circuit
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Resilience Guard: Fallback circuit breaker prevents cascade
@circuit(failure_threshold=5, recovery_timeout=30, name="payment_gateway")
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.5, min=0.5, max=2.0),
    retry=retry_if_exception_type(requests.exceptions.RequestException)
)
def process_order_payment(order_id: str, amount: float, user_token: str) -> dict:
    """
    Resilient payment call protected by retry backoff and circuit breaker.
    Gracefully raises PaymentServiceUnavailableError for async queuing.
    """
    try:
        response = requests.post(
            f"{PAYMENT_SERVICE_URL}/v1/charges",
            json={"order_id": order_id, "amount": amount},
            headers={"Authorization": f"Bearer {user_token}"},
            timeout=2.0  # Strict 2-second timeout cap
        )
        response.raise_for_status()
        return response.json()
    except (requests.exceptions.RequestException, Exception) as exc:
        logger.error(f"Payment dispatch failure for order {order_id}: {exc}")
        # Enqueue to background retry queue instead of failing user checkout
        enqueue_payment_fallback(order_id, amount)
        raise PaymentServiceUnavailableError("Payment temporarily deferred")`,
  }
};

export const MOCK_METRICS = {
  timeseries: [
    { time: '12:00', errorRate: 0.1, responseTime: 38, cpu: 22, memory: 48, requestRate: 1400 },
    { time: '12:01', errorRate: 0.1, responseTime: 39, cpu: 23, memory: 48, requestRate: 1410 },
    { time: '12:02', errorRate: 0.2, responseTime: 41, cpu: 25, memory: 49, requestRate: 1420 },
    { time: '12:03', errorRate: 0.1, responseTime: 40, cpu: 24, memory: 48, requestRate: 1390 },
    { time: '12:04', errorRate: 1.2, responseTime: 85, cpu: 45, memory: 56, requestRate: 1410 },
    { time: '12:05', errorRate: 18.6, responseTime: 1480, cpu: 74, memory: 72, requestRate: 1220 }, // Fault injected
    { time: '12:06', errorRate: 34.8, responseTime: 3200, cpu: 78, memory: 75, requestRate: 980 },  // Peak impact
    { time: '12:07', errorRate: 22.4, responseTime: 1950, cpu: 65, memory: 69, requestRate: 1100 },
    { time: '12:08', errorRate: 4.8, responseTime: 220, cpu: 38, memory: 54, requestRate: 1360 },  // Recovery
    { time: '12:09', errorRate: 0.3, responseTime: 45, cpu: 24, memory: 50, requestRate: 1410 },
    { time: '12:10', errorRate: 0.1, responseTime: 38, cpu: 22, memory: 49, requestRate: 1420 },
  ],
  liveLogs: [
    { id: 'log-1', timestamp: '12:04:20.104', level: 'INFO', service: 'faultlens-orchestrator', message: 'Target container [cnt_payment_01f] fault experiment initiated. Chaos injector: kill_sigterm.' },
    { id: 'log-2', timestamp: '12:04:22.418', level: 'ERROR', service: 'payment-service', message: 'Database connection pool timeout while acquiring lease: connection pool closed.' },
    { id: 'log-3', timestamp: '12:04:23.902', level: 'WARN', service: 'order-service', message: 'POST http://payment-service:8083/v1/charges read timeout after 2500ms. Thread 14 blocked.' },
    { id: 'log-4', timestamp: '12:04:24.015', level: 'ERROR', service: 'order-service', message: 'Order fulfillment transaction [ord_98921b] failed: Payment dependency unreachable.' },
    { id: 'log-5', timestamp: '12:04:25.680', level: 'ERROR', service: 'api-gateway', message: 'Upstream HTTP 504 Gateway Timeout returned on endpoint /api/v1/checkout.' },
    { id: 'log-6', timestamp: '12:04:28.112', level: 'WARN', service: 'order-service', message: 'Thread pool utilization warning: 88/100 active connections in WAIT_IO state.' },
    { id: 'log-7', timestamp: '12:04:31.450', level: 'ERROR', service: 'api-gateway', message: 'Circuit breaker trip threshold not reached (no policy configured). Dropping client stream.' },
    { id: 'log-8', timestamp: '12:04:36.782', level: 'INFO', service: 'faultlens-telemetry', message: 'Cascade trajectory mapped: payment-service -> order-service -> api-gateway.' },
  ]
};

export const MOCK_COMPOSE_TEMPLATE = `version: '3.8'

services:
  api-gateway:
    image: envoyproxy/envoy:v1.28-latest
    ports:
      - "8080:8080"
    depends_on:
      - auth-service
      - order-service
      - catalog-service

  auth-service:
    image: ecom/auth-service:v2.1
    ports:
      - "8081:8081"
    environment:
      - DB_HOST=postgres-db

  order-service:
    image: ecom/order-service:v3.4
    ports:
      - "8082:8082"
    depends_on:
      - payment-service
      - inventory-service
      - notification-service
      - postgres-db

  payment-service:
    image: ecom/payment-service:v1.9
    ports:
      - "8083:8083"
    environment:
      - DB_HOST=postgres-db

  inventory-service:
    image: ecom/inventory-service:v2.0
    ports:
      - "8084:8084"
    depends_on:
      - postgres-db

  catalog-service:
    image: ecom/catalog-service:v1.5
    ports:
      - "8085:8085"
    depends_on:
      - postgres-db

  notification-service:
    image: ecom/notif-worker:v1.2
    depends_on:
      - postgres-db

  postgres-db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ecom_db
`;
