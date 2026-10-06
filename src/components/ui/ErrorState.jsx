import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while communicating with the service endpoint. Please retry.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center bg-rose-950/20 border border-rose-800/40 rounded-xl ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-rose-900/30 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-200">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-sm mt-1 mb-5 leading-relaxed font-mono">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}
