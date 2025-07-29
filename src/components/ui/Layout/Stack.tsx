import React from 'react';

export type StackDirection = 'vertical' | 'horizontal';
export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  spacing?: StackSpacing;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  children,
  ...props
}) => {
  // Direction classes
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  // Spacing classes - different for vertical vs horizontal
  const verticalSpacingClasses = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',    // Your current standard
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  const horizontalSpacingClasses = {
    none: 'space-x-0',
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
  };

  // Alignment classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  // Justify classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const spacingClass = direction === 'vertical' 
    ? verticalSpacingClasses[spacing]
    : horizontalSpacingClasses[spacing];

  const combinedClasses = [
    'flex',
    directionClasses[direction],
    spacingClass,
    alignClasses[align],
    justifyClasses[justify],
    wrap ? 'flex-wrap' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Stack;