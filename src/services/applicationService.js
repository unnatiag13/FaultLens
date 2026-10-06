import { MOCK_APPLICATIONS, MOCK_SERVICES, MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../data/mockData';

const APPS_STORAGE_KEY = 'faultlens_apps_store';

function getStoredApps() {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return MOCK_APPLICATIONS;
}

function saveStoredApps(apps) {
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
}

export const applicationService = {
  async getApplications() {
    // FastAPI: GET /api/applications
    await new Promise((r) => setTimeout(r, 200));
    return getStoredApps();
  },

  async getApplicationById(id) {
    // FastAPI: GET /api/applications/:id
    await new Promise((r) => setTimeout(r, 150));
    const apps = getStoredApps();
    const app = apps.find((a) => a.id === id) || apps[0];
    return app;
  },

  async getServices(appId = 'app-ecommerce') {
    // FastAPI: GET /api/applications/:id/services
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_SERVICES[appId] || MOCK_SERVICES['app-ecommerce'];
  },

  async getServiceById(appId, serviceId) {
    // FastAPI: GET /api/applications/:id/services/:serviceId
    await new Promise((r) => setTimeout(r, 100));
    const services = MOCK_SERVICES[appId] || MOCK_SERVICES['app-ecommerce'];
    return services.find((s) => s.id === serviceId) || null;
  },

  async getDependencies(appId = 'app-ecommerce') {
    // FastAPI: GET /api/applications/:id/dependencies
    await new Promise((r) => setTimeout(r, 250));
    return {
      nodes: MOCK_GRAPH_NODES,
      edges: MOCK_GRAPH_EDGES,
    };
  },

  async connectApplication(appData) {
    // FastAPI: POST /api/applications/connect
    await new Promise((r) => setTimeout(r, 500));
    const current = getStoredApps();
    const newApp = {
      id: `app-${Date.now().toString(36)}`,
      name: appData.name || 'Custom Isolated Application',
      status: 'Connected',
      statusType: 'healthy',
      description: appData.description || 'Imported Docker Compose configuration running in strict container isolation.',
      environment: `${appData.environment || 'Testing'} (Isolated Sandbox)`,
      isolation: 'Strict Container Isolation Enabled',
      servicesCount: 6,
      dependenciesCount: 7,
      experimentsCount: 0,
      activeIssues: 0,
      lastExperiment: {
        name: 'None',
        status: 'Unexercised',
        result: 'Ready for initial test',
        time: 'Just now',
      },
      lastUpdated: 'Just now',
      repository: appData.repository || 'Uploaded local compose file',
      composeFile: 'docker-compose.yml',
    };
    current.unshift(newApp);
    saveStoredApps(current);
    return newApp;
  }
};
