import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, AlertTriangle, XCircle, Server } from 'lucide-react';

const STATUS_CONFIG = {
  HEALTHY: {
    label: 'HEALTHY',
    bgClass: 'node-healthy',
    badgeClass: 'badge-healthy',
    icon: CheckCircle2,
    iconColor: '#10b981',
  },
  DEGRADED: {
    label: 'DEGRADED',
    bgClass: 'node-degraded',
    badgeClass: 'badge-degraded',
    icon: AlertTriangle,
    iconColor: '#f59e0b',
  },
  FAILED: {
    label: 'FAILED',
    bgClass: 'node-failed',
    badgeClass: 'badge-failed',
    icon: XCircle,
    iconColor: '#ef4444',
  },
};

const ServiceNode = ({ data }) => {
  const status = data.status || 'HEALTHY';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.HEALTHY;
  const StatusIcon = config.icon;

  return (
    <div className={`service-node ${config.bgClass}`}>
      <Handle type="target" position={Position.Top} className="custom-handle" />
      
      <div className="node-header">
        <div className="node-icon-wrapper">
          <Server size={18} className="server-icon" />
        </div>
        <div className="node-title-group">
          <span className="node-title">{data.name}</span>
          <span className="node-id">{data.id}</span>
        </div>
      </div>

      <div className="node-body">
        <div className={`status-badge ${config.badgeClass}`}>
          <StatusIcon size={14} color={config.iconColor} />
          <span>{config.label}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
    </div>
  );
};

export default memo(ServiceNode);
