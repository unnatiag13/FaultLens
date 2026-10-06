import { MOCK_EXPERIMENTS, MOCK_INCIDENT_TIMELINE } from '../data/mockData';

const EXP_STORAGE_KEY = 'faultlens_experiments_store';

function getStoredExperiments() {
  try {
    const raw = localStorage.getItem(EXP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return MOCK_EXPERIMENTS;
}

function saveStoredExperiments(experiments) {
  localStorage.setItem(EXP_STORAGE_KEY, JSON.stringify(experiments));
}

export const experimentService = {
  async getExperiments(appId = null) {
    // FastAPI: GET /api/experiments?application_id=...
    await new Promise((r) => setTimeout(r, 200));
    const all = getStoredExperiments();
    if (appId) {
      return all.filter((e) => e.applicationId === appId);
    }
    return all;
  },

  async getExperimentById(id) {
    // FastAPI: GET /api/experiments/:id
    await new Promise((r) => setTimeout(r, 150));
    const all = getStoredExperiments();
    return all.find((e) => e.id === id) || all[0];
  },

  async createExperiment(data) {
    // FastAPI: POST /api/experiments
    await new Promise((r) => setTimeout(r, 300));
    const all = getStoredExperiments();
    const newExp = {
      id: `exp-${Date.now().toString(36)}`,
      name: data.name || `${data.targetServiceName || 'Service'} ${data.faultType} Test`,
      applicationId: data.applicationId || 'app-ecommerce',
      applicationName: data.applicationName || 'E-Commerce Platform',
      targetServiceId: data.targetServiceId || 'payment-service',
      targetServiceName: data.targetServiceName || 'Payment Service',
      faultType: data.faultType || 'Service Failure',
      severity: data.severity || 'High',
      duration: Number(data.duration) || 60,
      elapsed: 0,
      status: 'Running',
      result: 'Active Telemetry Streaming',
      confidence: 'Evaluating...',
      date: 'Just now',
      timestamp: new Date().toISOString(),
      description: data.description || 'Controlled fault injection executed in isolated sandbox environment.',
      environment: 'Docker Compose (Isolated)',
    };
    all.unshift(newExp);
    saveStoredExperiments(all);
    return newExp;
  },

  async getTimeline(experimentId) {
    // FastAPI: GET /api/experiments/:id/timeline
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_INCIDENT_TIMELINE;
  },

  async stopExperiment(id) {
    // FastAPI: POST /api/experiments/:id/stop
    await new Promise((r) => setTimeout(r, 200));
    const all = getStoredExperiments();
    const exp = all.find((e) => e.id === id);
    if (exp) {
      exp.status = 'Completed';
      exp.result = 'Stopped by Operator';
      saveStoredExperiments(all);
    }
    return exp;
  }
};
