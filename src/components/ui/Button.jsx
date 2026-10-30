import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-space-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4.5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:   'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-sm shadow-brand-primary/30 border border-brand-primary/40 focus:ring-brand-primary',
    secondary: 'bg-[#1A1A1A] hover:bg-[#222222] text-slate-200 border border-[#2E2E2E] focus:ring-[#444444]',
    danger:    'bg-rose-700 hover:bg-rose-600 text-white shadow-sm border border-rose-600/40 focus:ring-rose-500',
    outline:   'bg-transparent hover:bg-[#1A1A1A] text-slate-300 border border-[#2E2E2E] focus:ring-[#444444]',
    ghost:     'bg-transparent hover:bg-[#1A1A1A] text-slate-300 hover:text-white border-transparent focus:ring-[#444444]',
    ai:        'bg-gradient-to-r from-brand-primary to-orange-500 hover:from-brand-primaryHover hover:to-orange-400 text-white border border-brand-primary/40 shadow-sm shadow-brand-primary/20 focus:ring-brand-primary',
    cyan:      'bg-brand-primary hover:bg-brand-primaryHover text-white border border-brand-primary/40 shadow-sm shadow-brand-primary/20 focus:ring-brand-primary',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
    </button>
  );
}
