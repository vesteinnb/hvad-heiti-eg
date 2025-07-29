import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="mb-2">
          {breadcrumbs}
        </div>
      )}

      {/* Main header content */}
      <div className="flex items-center justify-between w-full">
        {/* Left side - Title and subtitle */}
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          {icon && (
            <div className="text-2xl">
              {icon}
            </div>
          )}

          {/* Title and subtitle */}
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold text-neutral-700 tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="text-neutral-600 font-body mt-1">
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
    </div>
  );
};

export default PageHeader;