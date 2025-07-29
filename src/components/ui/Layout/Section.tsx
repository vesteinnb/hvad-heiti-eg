import React from 'react';

export type SectionVariant = 'default' | 'highlighted' | 'bordered';
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  icon,
  action,
  variant = 'default',
  spacing = 'md',
  className = '',
  children,
  ...props
}) => {
  // Variant-specific classes
  const variantClasses = {
    default: '',
    highlighted: 'bg-primary/5 border border-primary/10 rounded-xl p-4',
    bordered: 'border border-gray-200 rounded-xl p-4',
  };

  // Spacing classes
  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  const sectionClasses = [
    'w-full',
    variantClasses[variant],
    spacingClasses[spacing],
    className,
  ].filter(Boolean).join(' ');

  const hasHeader = title || subtitle || icon || action;

  return (
    <section className={sectionClasses} {...props}>
      {/* Section Header */}
      {hasHeader && (
        <div className="flex items-center justify-between w-full">
          {/* Left side - Title, subtitle, icon */}
          <div className="flex items-center gap-2 flex-1">
            {/* Icon */}
            {icon && (
              <div className="text-xl">
                {icon}
              </div>
            )}

            {/* Title and subtitle */}
            <div className="flex-1">
              {title && (
                <h2 className="text-lg font-heading font-semibold text-primary">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-600 font-body mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Action */}
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className={hasHeader ? 'pt-2' : ''}>
        {children}
      </div>
    </section>
  );
};

export default Section;