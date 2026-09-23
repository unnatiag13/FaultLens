import React, { useState, useEffect, useCallback } from 'react';
import { Network, Activity } from 'lucide-react';
import SystemGraph from './components/SystemGraph';
import FaultControls from './components/FaultControls';
import { fetchSystemState, injectFault, resetSystem } from './services/api';

function App() {
  const [services, setServices] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSystemState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSystemState();
      setServices(data.services || []);
      setDependencies(data.dependencies || []);
    } catch (err) {
      console.error('Failed to load system state:', err);
      setError('Could not connect to FaultLens backend. Ensure FastAPI server is running on http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSystemState();
  }, [loadSystemState]);

  const handleInjectFault = async (serviceId, faultType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await injectFault(serviceId, faultType);
      setServices(data.services || []);
      setDependencies(data.dependencies || []);
    } catch (err) {
      console.error('Fault injection error:', err);
      setError(`Fault injection failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSystem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resetSystem();
      setServices(data.services || []);
      setDependencies(data.dependencies || []);
    } catch (err) {
      console.error('Reset system error:', err);
      setError(`Reset failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Status counts for header summary
  const healthyCount = services.filter((s) => s.status === 'HEALTHY').length;
  const degradedCount = services.filter((s) => s.status === 'DEGRADED').length;
  const failedCount = services.filter((s) => s.status === 'FAILED').length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-section">
          <Network className="brand-icon" size={28} />
          <div>
            <h1 className="brand-title">FaultLens</h1>
            <p className="brand-subtitle">Graph-Driven Continuous Resilience Simulator</p>
          </div>
        </div>

        <div className="status-summary">
          <div className="summary-pill healthy">
            <Activity size={14} />
            <span>{healthyCount} Healthy</span>
          </div>
          {degradedCount > 0 && (
            <div className="summary-pill degraded">
              <Activity size={14} />
              <span>{degradedCount} Degraded</span>
            </div>
          )}
          {failedCount > 0 && (
            <div className="summary-pill failed">
              <Activity size={14} />
              <span>{failedCount} Failed</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <SystemGraph services={services} dependencies={dependencies} />
        
        <aside className="sidebar-panel">
          {error && <div className="error-banner">{error}</div>}
          <FaultControls
            services={services}
            onInjectFault={handleInjectFault}
            onResetSystem={handleResetSystem}
            loading={loading}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
