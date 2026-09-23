import React, { useState } from 'react';
import { Zap, RefreshCw, AlertCircle } from 'lucide-react';

const FaultControls = ({
  services = [],
  onInjectFault,
  onResetSystem,
  loading = false,
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [faultType, setFaultType] = useState('SERVICE_DOWN');

  // Handle default selection when services load
  const activeService = selectedService || (services.length > 0 ? services[0].id : '');

  const handleInject = (e) => {
    e.preventDefault();
    if (!activeService) return;
    onInjectFault(activeService, faultType);
  };

  return (
    <div className="fault-controls-card">
      <div className="controls-header">
        <Zap className="header-icon" size={20} />
        <h3>Fault Injection Control</h3>
      </div>

      <form onSubmit={handleInject} className="controls-form">
        <div className="form-group">
          <label htmlFor="service-select">Target Service:</label>
          <select
            id="service-select"
            value={activeService}
            onChange={(e) => setSelectedService(e.target.value)}
            disabled={loading || services.length === 0}
            className="form-select"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.id}) - [{service.status}]
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fault-select">Fault Type:</label>
          <select
            id="fault-select"
            value={faultType}
            onChange={(e) => setFaultType(e.target.value)}
            disabled={loading}
            className="form-select"
          >
            <option value="SERVICE_DOWN">SERVICE_DOWN (Full Outage)</option>
          </select>
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={loading || !activeService}
            className="btn btn-inject"
          >
            <AlertCircle size={16} />
            <span>Inject Fault</span>
          </button>

          <button
            type="button"
            onClick={onResetSystem}
            disabled={loading}
            className="btn btn-reset"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Reset System</span>
          </button>
        </div>
      </form>

      <div className="controls-footer-info">
        <span className="info-dot"></span>
        <span>A → B means A depends on B. Injecting fault at target propagates upstream.</span>
      </div>
    </div>
  );
};

export default FaultControls;
