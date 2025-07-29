import React from 'react';

// Button variant types based on your current design system
export type ButtonVariant = 
  | 'primary'     // Gradient primary buttons
  | 'secondary'   // Secondary/accent colored buttons  
  | 'outline'     // Outlined buttons
  | 'ghost'       // Text-only buttons
  | 'danger'      // Delete/destructive actions
  | 'google';     // Google OAuth button

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes that apply to all buttons
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-heading font-semibold',
    'rounded-xl',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'disabled:hover:scale-100', // Prevent scaling when disabled
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm min-h-[32px]',
    md: 'py-3 px-6 text-base min-h-[48px]',
    lg: 'py-3 px-6 text-lg min-h-[52px]'
  };

  // Variant-specific classes
  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-primary to-primary/80',
      'text-white',
      'shadow-md hover:shadow-lg',
      'focus:ring-primary',
      'hover:scale-105 active:scale-100',
    ].join(' '),
    
    secondary: [
      'bg-gradient-to-r from-secondary to-accent',
      'text-neutral-700',
      'shadow-md hover:shadow-lg',
      'focus:ring-secondary',
      'hover:scale-105 active:scale-100',
    ].join(' '),
    
    outline: [
      'border-2 border-primary/30',
      'bg-white',
      'text-primary',
      'hover:bg-primary/5',
      'focus:ring-primary/20 focus:border-primary/60',
    ].join(' '),
    
    ghost: [
      'text-primary',
      'hover:bg-primary/10',
      'focus:ring-primary/20',
      'underline hover:no-underline',
    ].join(' '),
    
    danger: [
      'bg-red-600',
      'text-white',
      'shadow-md hover:shadow-lg',
      'hover:bg-red-700',
      'focus:ring-red-400',
      'hover:scale-105 active:scale-100',
    ].join(' '),
    
    google: [
      'bg-white',
      'text-neutral-700',
      'border border-gray-300',
      'shadow-md hover:shadow-lg',
      'hover:bg-gray-50',
      'focus:ring-primary',
    ].join(' '),
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {/* Icon */}
      {!loading && icon && (
        <span className="inline-flex items-center justify-center">
          {icon}
        </span>
      )}
      
      {/* Button text */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </button>
  );
};

export default Button;