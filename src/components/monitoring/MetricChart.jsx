import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function MetricChart({
  data = [],
  dataKey = 'errorRate',
  title = 'Metric Trend',
  strokeColor = '#DC2626',
  fillColor = 'rgba(220, 38, 38, 0.15)',
  unit = '%',
  height = 240,
  referenceThreshold,
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-space-900 border border-slate-700/80 p-2.5 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-slate-400 mb-1">Time: {label}</p>
          <p className="font-semibold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
            <span>{payload[0].value}{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-panel border border-slate-800/80 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold text-slate-200 tracking-tight">{title}</h4>
        {referenceThreshold && (
          <span className="text-[10px] font-mono text-slate-400">
            Threshold: {referenceThreshold}{unit}
          </span>
        )}
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
              tickFormatter={(v) => `${v}${unit === '%' ? '%' : ''}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
