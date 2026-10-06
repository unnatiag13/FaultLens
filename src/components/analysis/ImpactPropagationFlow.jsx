import React from 'react';
import { ArrowDown, Radio, AlertTriangle, XCircle, Users, Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ImpactPropagationFlow({ propagationPath = [] }) {
  return (
    <div className="flex flex-col items-center space-y-3 py-4 max-w-lg mx-auto">
      {propagationPath.map((step, idx) => {
        let borderClass = 'border-slate-700 bg-space-950';
        let badgeVariant = 'neutral';
        let icon = <Activity className="w-4 h-4 text-slate-400" />;

        if (step.status === 'critical') {
          borderClass = 'border-rose-600/80 bg-rose-950/40 shadow-lg shadow-rose-950/30';
          badgeVariant = 'critical';
          icon = <XCircle className="w-4 h-4 text-rose-400" />;
        } else if (step.status === 'degraded') {
          borderClass = 'border-amber-600/80 bg-amber-950/30 shadow-lg shadow-amber-950/20';
          badgeVariant = 'degraded';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
        } else if (step.status === 'warning') {
          borderClass = 'border-amber-600/60 bg-amber-950/20';
          badgeVariant = 'degraded';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
        }

        if (step.id === 'user-requests') {
          icon = <Users className="w-4 h-4 text-rose-400" />;
        }

        return (
          <React.Fragment key={step.id}>
            <div className={`w-full p-4 rounded-xl border ${borderClass} transition-all duration-200`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-space-900 border border-slate-700/60">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{step.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{step.role}</p>
                  </div>
                </div>
                <Badge variant={badgeVariant} size="sm">
                  {step.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-2 pt-2 border-t border-slate-800/80">
                Impact: <span className="font-semibold text-slate-200">{step.impact}</span>
              </p>
            </div>

            {idx < propagationPath.length - 1 && (
              <div className="flex flex-col items-center text-slate-500 py-0.5">
                <div className="w-0.5 h-4 bg-gradient-to-b from-slate-600 to-rose-600/60" />
                <ArrowDown className="w-4 h-4 text-rose-500 animate-bounce my-0.5" />
                <div className="w-0.5 h-4 bg-gradient-to-b from-rose-600/60 to-slate-600" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
