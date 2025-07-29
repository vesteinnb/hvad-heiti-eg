import React from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: ContainerPadding;
  centered?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  size = 'md',
  padding = 'md',
  centered = true,
  className = '',
  children,
  ...props
}) => {
  // Size-specific max-width classes
  const sizeClasses = {
    sm: 'max-w-sm',     // 384px - for narrow forms
    md: 'max-w-md',     // 448px - your current standard
    lg: 'max-w-lg',     // 512px - for wider content
    xl: 'max-w-2xl',    // 672px - for complex forms
    full: 'max-w-full', // No max width
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'px-2 py-4',
    md: 'px-4 py-8',    // Your current standard
    lg: 'px-6 py-12',
  };

  // Base classes
  const baseClasses = [
    'w-full',
    centered ? 'mx-auto' : '',
    'flex flex-col',
  ].filter(Boolean).join(' ');

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;