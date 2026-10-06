import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Server,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
  FileText,
  ShieldAlert,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ServiceDetailsPanel({ service, onClose }) {
  const navigate = useNavigate();

  if (!service) return null;

  const isFailed = service.status === 'critical' || service.status === 'failed';
  const isDegraded = service.status === 'degraded' || service.status === 'warning';

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-space-900/95 backdrop-blur-md border-l border-slate-700/80 shadow-2xl z-20 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-brand-cyan shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{service.name || service.label}</h3>
            <p className="text-[11px] text-slate-400 font-mono truncate">{service.type || service.serviceType} • Port {service.port || 8080}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Status Section */}
        <div className="p-3 rounded-lg bg-space-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Service Health</span>
            <Badge variant={isFailed ? 'critical' : isDegraded ? 'degraded' : 'healthy'} size="sm">
              {isFailed ? 'FAILED' : isDegraded ? 'DEGRADED' : 'HEALTHY'}
            </Badge>
          </div>
          {service.description && (
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
              {service.description}
            </p>
          )}
        </div>

        {/* Runtime & Container Details */}
        <div>
          <h4 className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Environment & Runtime
          </h4>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-space-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Container ID</span>
              <span className="text-slate-200">{service.containerId || 'cnt_sandboxed_01'}</span>
            </div>
            <div className="p-2 rounded bg-space-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Runtime Stack</span>
              <span className="text-slate-200 truncate block">{service.runtime || 'Container'}</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h4 className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Live Telemetry Signals
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-space-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Response Time</span>
              </div>
              <p className={`text-sm font-semibold font-mono ${isFailed ? 'text-rose-300' : isDegraded ? 'text-amber-300' : 'text-slate-200'}`}>
                {service.responseTime || '18ms'}
              </p>
              {service.baselineResponseTime && (
                <span className="text-[10px] text-slate-400 block">Baseline: {service.baselineResponseTime}</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-space-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <AlertTriangle className={`w-3.5 h-3.5 ${isFailed ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>Error Rate</span>
              </div>
              <p className={`text-sm font-semibold font-mono ${isFailed ? 'text-rose-400' : isDegraded ? 'text-amber-400' : 'text-emerald-400'}`}>
                {service.errorRate || '0.0%'}
              </p>
              {service.baselineErrorRate && (
                <span className="text-[10px] text-slate-400 block">Normal: {service.baselineErrorRate}</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-space-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>CPU Usage</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 font-mono">
                {service.cpu || '24%'}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-space-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                <span>Memory</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 font-mono">
                {service.memory || '42%'}
              </p>
            </div>
          </div>
        </div>

        {/* Upstream / Downstream Relationships */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dependencies (Calls)</span>
            </div>
            {service.dependencies && service.dependencies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {service.dependencies.map((dep) => (
                  <span key={dep} className="px-2 py-0.5 rounded bg-space-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                    → {dep}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No external dependencies</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
              <span>Dependents (Called By)</span>
            </div>
            {service.dependents && service.dependents.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {service.dependents.map((dep) => (
                  <span key={dep} className="px-2 py-0.5 rounded bg-space-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                    ← {dep}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No registered dependents</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-space-950/80 flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={Flame}
          onClick={() => navigate(`/experiments/new?targetService=${service.id || service.label}`)}
          className="w-full"
        >
          Create Experiment on Service
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={FileText}
          onClick={() => navigate(`/monitoring?service=${service.id || service.label}`)}
          className="w-full"
        >
          View Telemetry & Logs
        </Button>
      </div>
    </div>
  );
}
