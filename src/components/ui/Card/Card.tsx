import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'game' | 'success' | 'error';
export type CardSize = 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  children,
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  // Base classes that apply to all cards
  const baseClasses = [
    'rounded-xl',
    'transition-all duration-200',
    interactive || onClick ? 'cursor-pointer' : '',
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  // Variant-specific classes
  const variantClasses = {
    default: [
      'bg-white/90',
      'shadow-sm',
      'border border-gray-100',
      interactive || onClick ? 'hover:shadow-md hover:scale-[1.02]' : '',
    ].join(' '),
    
    elevated: [
      'bg-white/90',
      'shadow-lg',
      interactive || onClick ? 'hover:shadow-xl hover:scale-[1.02]' : '',
    ].join(' '),
    
    outlined: [
      'bg-white',
      'border-2 border-gray-200',
      'shadow-sm',
      interactive || onClick ? 'hover:border-primary/30 hover:shadow-md' : '',
    ].join(' '),
    
    game: [
      'bg-primary/5',
      'border border-primary/10', 
      'shadow-sm',
      interactive || onClick ? 'hover:shadow-md hover:bg-primary/8' : '',
    ].join(' '),
    
    success: [
      'bg-green-50',
      'border border-green-200',
      'shadow-sm',
    ].join(' '),
    
    error: [
      'bg-red-50',
      'border border-red-200',
      'shadow-sm',
    ].join(' '),
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;