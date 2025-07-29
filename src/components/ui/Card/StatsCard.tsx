import React from 'react';
import Card from './Card';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'success' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  description,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Variant-specific styling
  const variantClasses = {
    default: 'text-neutral-700',
    success: 'text-green-600',
    primary: 'text-primary',
    secondary: 'text-secondary',
  };

  // Size-specific styling
  const sizeClasses = {
    sm: {
      icon: 'text-lg',
      value: 'text-lg font-mono font-bold',
      label: 'text-xs font-body',
      description: 'text-xs',
    },
    md: {
      icon: 'text-xl',
      value: 'text-2xl font-mono font-bold',
      label: 'text-sm font-body',
      description: 'text-xs',
    },
    lg: {
      icon: 'text-2xl',
      value: 'text-3xl font-mono font-bold', 
      label: 'text-base font-body',
      description: 'text-sm',
    },
  };

  return (
    <Card variant="default" size={size} className={`text-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        {/* Icon */}
        <div className={`${sizeClasses[size].icon} ${variantClasses[variant]}`}>
          {icon}
        </div>
        
        {/* Value */}
        <div className={`${sizeClasses[size].value} ${variantClasses[variant]}`}>
          {value}
        </div>
        
        {/* Label */}
        <div className={`${sizeClasses[size].label} text-neutral-600`}>
          {label}
        </div>
        
        {/* Description */}
        {description && (
          <div className={`${sizeClasses[size].description} text-neutral-500`}>
            {description}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;