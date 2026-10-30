import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, HelpCircle, Activity, Sparkles } from 'lucide-react';

export function Badge({
  variant = 'neutral',
  children,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const getVariantDetails = () => {
    switch (variant.toLowerCase()) {
      case 'healthy':
      case 'operational':
      case 'completed':
      case 'success':
        return {
          classes: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 shadow-sm shadow-emerald-950/50',
          icon: <CheckCircle2 className={`${iconSizes[size]} text-emerald-400 shrink-0`} />,
        };
      case 'degraded':
      case 'warning':
      case 'warn':
        return {
          classes: 'bg-amber-950/60 text-amber-300 border-amber-700/50 shadow-sm shadow-amber-950/50',
          icon: <AlertTriangle className={`${iconSizes[size]} text-amber-400 shrink-0`} />,
        };
      case 'critical':
      case 'failed':
      case 'error':
        return {
          classes: 'bg-rose-950/70 text-rose-300 border-rose-700/60 shadow-sm shadow-rose-950/50',
          icon: <XCircle className={`${iconSizes[size]} text-rose-400 shrink-0`} />,
        };
      case 'running':
      case 'active':
        return {
          classes: 'bg-brand-primary/10 text-orange-300 border-brand-primary/40 shadow-sm',
          icon: <Activity className={`${iconSizes[size]} text-brand-primary shrink-0 animate-pulse`} />,
        };
      case 'ai':
        return {
          classes: 'bg-brand-primary/10 text-orange-300 border-brand-primary/30',
          icon: <Sparkles className={`${iconSizes[size]} text-brand-ai shrink-0`} />,
        };
      case 'info':
        return {
          classes: 'bg-[#1A1A1A] text-[#888888] border-[#2E2E2E]',
          icon: <Clock className={`${iconSizes[size]} text-brand-primary shrink-0`} />,
        };
      case 'neutral':
      default:
        return {
          classes: 'bg-[#1A1A1A] text-slate-300 border-[#2E2E2E]',
          icon: <HelpCircle className={`${iconSizes[size]} text-[#888888] shrink-0`} />,
        };
    }
  };

  const details = getVariantDetails();

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full select-none ${details.classes} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && details.icon}
      <span>{children}</span>
    </span>
  );
}
