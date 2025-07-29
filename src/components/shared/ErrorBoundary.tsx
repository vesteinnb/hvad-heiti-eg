import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 py-8">
          <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl mb-4">😞</div>
            <div className="text-2xl font-heading font-bold text-neutral-700 mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-neutral-600 font-body mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </div>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md bg-gray-100 text-neutral-700 hover:bg-gray-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105 active:scale-100"
              >
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="w-full mt-4 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 font-semibold mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs font-mono overflow-auto max-h-40">
                  <div className="font-semibold text-red-700 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <div className="text-red-600">
                    {this.state.error.stack}
                  </div>
                  {this.state.errorInfo && (
                    <div className="mt-2 text-red-600">
                      Component Stack: {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;