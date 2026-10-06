import React, { createContext, useContext, useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('app-ecommerce');
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const list = await applicationService.getApplications();
      setApplications(list);
      if (list.length > 0 && !list.find((a) => a.id === selectedAppId)) {
        setSelectedAppId(list[0].id);
      }
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0] || null;

  return (
    <AppContext.Provider
      value={{
        applications,
        selectedApp,
        selectedAppId,
        setSelectedAppId,
        refreshApplications: fetchApps,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
