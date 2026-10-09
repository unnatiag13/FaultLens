
import { MOCK_APPLICATIONS } from '../data/mockData';

const API_BASE = '/api/v1/applications';

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const applicationService = {
  async getApplications() {
    return apiRequest(API_BASE);
  },

  async getApplicationById(id) {
    return apiRequest(`${API_BASE}/${id}`);
  },

  async getServices(appId = 'app-ecommerce') {
    return apiRequest(`${API_BASE}/${appId}/services`);
  },

  async getServiceById(appId, serviceId) {
    const services = await this.getServices(appId);
    return services.find((service) => service.id === serviceId) || null;
  },

  async getDependencies(appId = 'app-ecommerce') {
    return apiRequest(`${API_BASE}/${appId}/dependencies`);
  },

  async connectApplication(appData) {
    return apiRequest(`${API_BASE}/connect`, {
      method: 'POST',
      body: JSON.stringify({
        name: appData.name,
        description: appData.description || '',
        composeYaml: appData.composeYaml,
        environment: appData.environment || 'Testing',
        isolation: appData.isolation ?? true,
      }),
    });
  },
};