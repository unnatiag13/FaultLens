import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading data...', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`${sizeMap[size]} text-brand-primary animate-spin mb-3`} />
      <p className="text-xs text-slate-400 font-mono tracking-wide">{message}</p>
    </div>
  );
}

export function SkeletonCard({ rows = 3, className = '' }) {
  return (
    <div className={`bg-panel border border-slate-800/80 rounded-xl p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-800/60 rounded"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGraph({ className = '' }) {
  return (
    <div className={`w-full h-96 bg-space-900/60 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 engineering-grid opacity-30 animate-pulse" />
      <div className="text-center relative z-10">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-200">Analyzing dependency graph topology...</p>
        <p className="text-xs text-slate-500 mt-1 font-mono">Tracing inter-service socket graphs and Docker endpoints</p>
      </div>
    </div>
  );
}
