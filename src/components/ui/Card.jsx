import React from 'react';

export function Card({ children, className = '', hover = false, onClick, ...props }) {
  const hoverStyles = hover
    ? 'hover:border-slate-600/60 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-panel border border-slate-800/80 rounded-xl shadow-lg shadow-black/20 overflow-hidden ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`p-5 pb-3 border-b border-slate-800/60 flex items-center justify-between gap-4 ${className}`}>
      <div className="min-w-0 flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-slate-100 tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs text-slate-400 ${className}`}>
      {children}
    </div>
  );
}
