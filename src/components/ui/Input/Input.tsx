import React from 'react';

export type InputVariant = 'default' | 'error' | 'success';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  icon,
  className = '',
  id,
  ...props
}) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine actual variant based on error state
  const actualVariant = error ? 'error' : variant;

  // Base classes that apply to all inputs
  const baseClasses = [
    'font-body text-neutral-800',
    'bg-white',
    'border-2 rounded-xl',
    'placeholder-neutral-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'transition-all duration-200',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
    icon ? 'pl-12' : '', // Add left padding if icon exists
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm min-h-[36px]',
    md: 'py-3 px-5 text-base min-h-[48px]',
    lg: 'py-4 px-6 text-lg min-h-[56px]'
  };

  // Variant-specific classes
  const variantClasses = {
    default: [
      'border-gray-200',
      'focus:ring-primary/20 focus:border-primary/60',
      'hover:border-gray-300',
    ].join(' '),
    
    error: [
      'border-error',
      'focus:ring-error/20 focus:border-error',
    ].join(' '),
    
    success: [
      'border-green-400',
      'focus:ring-green-200 focus:border-green-500',
    ].join(' '),
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[actualVariant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block font-body text-sm text-neutral-700 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          className={combinedClasses}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div 
          id={`${inputId}-error`}
          className="text-error text-xs mt-1 animate-shake"
        >
          {error}
        </div>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <div 
          id={`${inputId}-helper`}
          className="text-neutral-500 text-xs mt-1"
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;