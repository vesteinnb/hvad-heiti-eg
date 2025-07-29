import React from 'react';
import Container from './Container';

export type PageBackground = 'default' | 'neutral' | 'success' | 'gradient';

interface PageLayoutProps {
  children: React.ReactNode;
  background?: PageBackground;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  background = 'neutral',
  containerSize = 'md',
  centered = true,
  className = '',
}) => {
  // Background-specific classes
  const backgroundClasses = {
    default: 'bg-white',
    neutral: 'bg-neutral-50',     // Your current standard
    success: 'bg-green-50',       // For success pages
    gradient: 'bg-gradient-to-br from-neutral-50 to-primary/5',
  };

  const pageClasses = [
    'min-h-screen',
    'flex flex-col items-center',
    backgroundClasses[background],
    className,
  ].filter(Boolean).join(' ');

  return (
    <main className={pageClasses}>
      <Container 
        size={containerSize}
        centered={centered}
        className="flex flex-col items-center space-y-6"
      >
        {children}
      </Container>
    </main>
  );
};

export default PageLayout;