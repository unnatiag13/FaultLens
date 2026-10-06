import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export function MetricCard({
  title,
  value,
  change,
  isIncreaseGood = false,
  unit = '',
  icon: Icon = Activity,
  status = 'neutral',
  subtitle,
}) {
  const getStatusColor = () => {
    if (status === 'critical') return 'text-rose-400';
    if (status === 'warning') return 'text-amber-400';
    if (status === 'healthy') return 'text-emerald-400';
    return 'text-slate-100';
  };

  const isIncrease = change && change.startsWith('+');
  const isGood = isIncrease ? isIncreaseGood : !isIncreaseGood;

  return (
    <div className="bg-panel border border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="w-6 h-6 rounded bg-space-950 border border-slate-800 flex items-center justify-center text-slate-400">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold font-mono tracking-tight ${getStatusColor()}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
        {change ? (
          <span className={`flex items-center gap-0.5 font-mono ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncrease ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        ) : (
          <span className="text-slate-500 font-mono">Stable</span>
        )}
        {subtitle && <span className="text-slate-500 text-[10px] truncate">{subtitle}</span>}
      </div>
    </div>
  );
}
