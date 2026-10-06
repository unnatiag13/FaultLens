import { MOCK_ROOT_CAUSE, MOCK_INCIDENT_TIMELINE } from '../data/mockData';

export const analysisService = {
  async getImpactAnalysis(experimentId = 'exp-101') {
    // FastAPI: GET /api/analysis/:experimentId/impact
    await new Promise((r) => setTimeout(r, 200));
    return {
      experimentId,
      faultInjected: {
        serviceId: 'payment-service',
        serviceName: 'Payment Service',
        faultType: 'Service Failure (SIGTERM process kill)',
        severity: 'High',
        injectedAt: '12:04:20',
      },
      result: 'Impact Detected',
      propagationPath: [
        { id: 'payment-service', name: 'Payment Service', role: 'Origin (Injected Fault)', status: 'critical', impact: '100% Unreachable' },
        { id: 'order-service', name: 'Order Service', role: 'Direct Consumer', status: 'degraded', impact: 'Worker thread saturation / 18.6% 503 errors' },
        { id: 'api-gateway', name: 'API Gateway', role: 'Edge Ingress', status: 'warning', impact: '12.4% 504 Gateway Timeouts' },
        { id: 'user-requests', name: 'Simulated User Traffic', role: 'End Users', status: 'critical', impact: '348 checkout attempts failed' },
      ],
      affectedServices: [
        {
          name: 'Payment Service',
          tier: 'Critical',
          status: 'critical',
          errorRate: '34.8%',
          latency: '3,200ms',
          detail: 'Primary failure point. Process termination stopped TCP socket listener.',
        },
        {
          name: 'Order Service',
          tier: 'Degraded',
          status: 'degraded',
          errorRate: '18.6%',
          latency: '1,480ms',
          detail: 'Blocking synchronous requests without circuit breaker fallback.',
        },
        {
          name: 'API Gateway',
          tier: 'Warning',
          status: 'warning',
          errorRate: '12.4%',
          latency: '420ms',
          detail: 'Ingress timeout cap triggered after 3000ms upstream latency.',
        }
      ],
      metricsComparison: {
        errorRate: { before: '0.08%', during: '34.8%', delta: '+34.72%' },
        responseTime: { before: '42ms', during: '1,480ms', delta: '+1,438ms' },
        requestFailures: { before: '0', during: '348', delta: '+348 reqs' },
        throughput: { before: '1,420 req/s', during: '980 req/s', delta: '-31%' },
      }
    };
  },

  async getRootCauseAnalysis(experimentId = 'exp-101') {
    // FastAPI: GET /api/analysis/:experimentId/root-cause
    await new Promise((r) => setTimeout(r, 200));
    return {
      ...MOCK_ROOT_CAUSE,
      timeline: MOCK_INCIDENT_TIMELINE,
    };
  }
};
