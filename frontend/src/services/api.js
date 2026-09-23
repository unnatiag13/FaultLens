import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSystemState = async () => {
  const response = await apiClient.get('/system');
  return response.data;
};

export const injectFault = async (serviceId, faultType = 'SERVICE_DOWN') => {
  const response = await apiClient.post('/faults/inject', {
    service_id: serviceId,
    fault_type: faultType,
  });
  return response.data;
};

export const resetSystem = async () => {
  const response = await apiClient.post('/system/reset');
  return response.data;
};

export default {
  fetchSystemState,
  injectFault,
  resetSystem,
};
