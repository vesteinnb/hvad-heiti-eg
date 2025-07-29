import React from 'react';

interface CountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  variant?: 'default' | 'primary' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  // Format count (e.g., 99+ if over max)
  const displayCount = count > max ? `${max}+` : count.toString();

  // Size-specific classes
  const sizeClasses = {
    sm: 'h-4 min-w-[16px] px-1 text-xs',
    md: 'h-5 min-w-[20px] px-1.5 text-xs',
  };

  // Variant-specific classes
  const variantClasses = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-primary text-white',
    error: 'bg-red-500 text-white',
  };

  const combinedClasses = [
    'inline-flex items-center justify-center',
    'rounded-full',
    'font-mono font-bold',
    'transition-all duration-150',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {displayCount}
    </span>
  );
};

export default CountBadge;