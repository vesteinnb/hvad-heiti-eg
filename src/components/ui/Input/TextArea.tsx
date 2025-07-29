import React from 'react';

export type TextAreaVariant = 'default' | 'error' | 'success';
export type TextAreaSize = 'sm' | 'md' | 'lg';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea: React.FC<TextAreaProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  rows = 3,
  resize = 'none',
  className = '',
  id,
  ...props
}) => {
  // Generate unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine actual variant based on error state
  const actualVariant = error ? 'error' : variant;

  // Base classes that apply to all textareas
  const baseClasses = [
    'font-body text-neutral-800',
    'bg-white',
    'border-2 rounded-xl',
    'placeholder-neutral-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'transition-all duration-200',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
    `resize-${resize}`,
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-5 text-base',
    lg: 'py-4 px-6 text-lg'
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
          htmlFor={textareaId}
          className="block font-body text-sm text-neutral-700 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* TextArea */}
      <textarea
        id={textareaId}
        className={combinedClasses}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <div 
          id={`${textareaId}-error`}
          className="text-error text-xs mt-1 animate-shake"
        >
          {error}
        </div>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <div 
          id={`${textareaId}-helper`}
          className="text-neutral-500 text-xs mt-1"
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default TextArea;