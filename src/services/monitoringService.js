import { MOCK_METRICS } from '../data/mockData';

export const monitoringService = {
  async getMetrics(serviceId = 'all', timeRange = '15m') {
    // FastAPI: GET /api/monitoring/metrics?service_id=...&range=...
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_METRICS.timeseries;
  },

  async getLiveLogs(serviceId = 'all', logLevel = 'ALL') {
    // FastAPI: GET /api/monitoring/logs?service_id=...&level=...
    await new Promise((r) => setTimeout(r, 150));
    let logs = [...MOCK_METRICS.liveLogs];
    if (logLevel !== 'ALL') {
      logs = logs.filter((l) => l.level === logLevel);
    }
    if (serviceId && serviceId !== 'all') {
      logs = logs.filter((l) => l.service === serviceId);
    }
    return logs;
  },

  async getActiveAlerts(appId = 'app-ecommerce') {
    // FastAPI: GET /api/monitoring/alerts?app_id=...
    await new Promise((r) => setTimeout(r, 100));
    return [
      {
        id: 'alt-1',
        severity: 'critical',
        service: 'Payment Service',
        title: 'Connection Refused (Container Process Down)',
        duration: '14m',
        metric: 'Error rate: 34.8%',
      },
      {
        id: 'alt-2',
        severity: 'warning',
        service: 'Order Service',
        title: 'Downstream Timeout Cascade',
        duration: '12m',
        metric: 'P99 Latency: 1,480ms',
      },
      {
        id: 'alt-3',
        severity: 'warning',
        service: 'API Gateway',
        title: 'Elevated 5xx Ingress Responses',
        duration: '9m',
        metric: 'HTTP 504: 12.4%',
      }
    ];
  }
};
