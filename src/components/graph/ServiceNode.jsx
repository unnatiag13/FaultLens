import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Server,
  Database,
  Network,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Radio
} from 'lucide-react';

function ServiceNodeComponent({ data, selected }) {
  const {
    label,
    serviceType,
    status = 'healthy',
    port,
    responseTime,
    errorRate,
    isTarget,
    isAffected,
  } = data;

  const getStatusConfig = () => {
    switch (status) {
      case 'critical':
      case 'failed':
        return {
          bg: 'bg-rose-950/80',
          border: 'border-rose-600',
          text: 'text-rose-200',
          badgeBg: 'bg-rose-900/60',
          badgeText: 'text-rose-300',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
          dot: 'bg-rose-500',
          ring: 'ring-2 ring-rose-500/50',
          label: 'FAILED',
        };
      case 'degraded':
      case 'warning':
        return {
          bg: 'bg-amber-950/70',
          border: 'border-amber-600',
          text: 'text-amber-200',
          badgeBg: 'bg-amber-900/60',
          badgeText: 'text-amber-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
          dot: 'bg-amber-500',
          ring: 'ring-2 ring-amber-500/40',
          label: 'DEGRADED',
        };
      case 'healthy':
      default:
        return {
          bg: 'bg-space-900/90',
          border: 'border-slate-700/80',
          text: 'text-slate-100',
          badgeBg: 'bg-emerald-950/70',
          badgeText: 'text-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
          dot: 'bg-emerald-500',
          ring: '',
          label: 'HEALTHY',
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getServiceIcon = () => {
    switch (serviceType?.toLowerCase()) {
      case 'gateway':
        return <Network className="w-4 h-4 text-cyan-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'worker':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      default:
        return <Server className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div
      className={`relative min-w-[210px] rounded-xl border backdrop-blur-md shadow-xl transition-all duration-200 select-none ${
        statusConfig.bg
      } ${statusConfig.border} ${statusConfig.ring} ${
        selected ? 'ring-2 ring-brand-cyan scale-[1.02] shadow-cyan-900/30' : ''
      }`}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-space-950 -top-1.5"
      />

      {/* Target Badge */}
      {isTarget && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md shadow-rose-950">
          <Radio className="w-2.5 h-2.5 animate-pulse" />
          <span>FAULT TARGET</span>
        </div>
      )}

      {/* Node Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-slate-950/70 border border-slate-700/60 flex items-center justify-center shrink-0">
            {getServiceIcon()}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">{label}</h4>
            <p className="text-[10px] text-slate-400 font-mono">{serviceType} {port ? `:${port}` : ''}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-mono font-medium ${statusConfig.badgeBg} ${statusConfig.badgeText} border border-current/20`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Node Metrics Summary */}
      <div className="px-3 py-2 grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/40 rounded-b-xl">
        <div>
          <span className="text-slate-500 block">Latency</span>
          <span className={`font-semibold ${status === 'critical' ? 'text-rose-300' : status === 'degraded' ? 'text-amber-300' : 'text-slate-300'}`}>
            {responseTime || '18ms'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Error Rate</span>
          <span className={`font-semibold ${status === 'critical' ? 'text-rose-400' : status === 'degraded' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {errorRate || '0.0%'}
          </span>
        </div>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-space-950 -bottom-1.5"
      />
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeComponent);
