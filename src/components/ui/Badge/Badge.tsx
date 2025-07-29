import React from 'react';

export type BadgeVariant = 
  | 'default'     // Gray neutral badge
  | 'primary'     // Primary color badge
  | 'secondary'   // Secondary color badge
  | 'success'     // Green success badge
  | 'warning'     // Orange warning badge
  | 'error'       // Red error badge
  | 'info'        // Blue info badge
  | 'game-code';  // Special styling for game codes

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  // Base classes that apply to all badges
  const baseClasses = [
    'inline-flex items-center gap-1',
    'font-medium',
    'rounded',
    'border',
    'transition-all duration-150',
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  // Variant-specific classes
  const variantClasses = {
    default: [
      'text-gray-600',
      'bg-gray-50',
      'border-gray-200',
    ].join(' '),
    
    primary: [
      'text-primary',
      'bg-primary/10',
      'border-primary/20',
    ].join(' '),
    
    secondary: [
      'text-secondary',
      'bg-secondary/10',
      'border-secondary/20',
    ].join(' '),
    
    success: [
      'text-green-600',
      'bg-green-50',
      'border-green-200',
    ].join(' '),
    
    warning: [
      'text-orange-600',
      'bg-orange-50',
      'border-orange-200',
    ].join(' '),
    
    error: [
      'text-red-600',
      'bg-red-50',
      'border-red-200',
    ].join(' '),
    
    info: [
      'text-blue-600',
      'bg-blue-50',
      'border-blue-200',
    ].join(' '),
    
    'game-code': [
      'text-primary',
      'bg-primary/10',
      'border-primary/20',
      'font-mono',
    ].join(' '),
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={combinedClasses}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className="inline-flex items-center justify-center">
          {icon}
        </span>
      )}
      
      {/* Badge content */}
      {children}
    </span>
  );
};

export default Badge;