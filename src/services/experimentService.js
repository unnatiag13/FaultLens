
const API_URL = '/api/v1/experiments';

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const experimentService = {
  async getExperiments(appId = null) {
    const query = appId
      ? `?application_id=${encodeURIComponent(appId)}`
      : '';

    return apiRequest(`${API_URL}${query}`);
  },

  async getExperimentById(id) {
    return apiRequest(`${API_URL}/${encodeURIComponent(id)}`);
  },

  async createExperiment(data) {
    return apiRequest(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  async getTimeline(experimentId) {
    return apiRequest(
      `${API_URL}/${encodeURIComponent(experimentId)}/timeline`
    );
  },

  async stopExperiment(id) {
    return apiRequest(
      `${API_URL}/${encodeURIComponent(id)}/stop`,
      { method: 'POST' }
    );
  },

  
async completeExperiment(id) {
  return apiRequest(
    `${API_URL}/${encodeURIComponent(id)}/complete`,
    { method: 'POST' }
  );
},
};