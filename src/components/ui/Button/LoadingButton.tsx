import React from 'react';
import Button from './Button';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
  loadingText?: string;
}

/**
 * LoadingButton - A specialized button that handles loading states
 * Perfect for form submissions and async operations
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  loadingText,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;