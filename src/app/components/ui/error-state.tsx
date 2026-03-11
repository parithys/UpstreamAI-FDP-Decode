import { AlertTriangle, RefreshCw, XCircle, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  /**
   * Type/severity of the error
   * @default 'error'
   */
  variant?: 'error' | 'warning' | 'network' | 'notFound';
  
  /**
   * Error title/heading
   */
  title?: string;
  
  /**
   * Detailed error message
   */
  message?: string;
  
  /**
   * Optional retry callback
   */
  onRetry?: () => void;
  
  /**
   * Whether to show the error in fullscreen mode
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * Custom className for additional styling
   */
  className?: string;
  
  /**
   * Whether the retry action is in progress
   */
  isRetrying?: boolean;
}

const variantConfig = {
  error: {
    icon: XCircle,
    iconColor: 'text-danger',
    defaultTitle: 'Something Went Wrong',
    defaultMessage: 'An unexpected error occurred. Please try again.'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    defaultTitle: 'Warning',
    defaultMessage: 'There may be issues with the data displayed.'
  },
  network: {
    icon: WifiOff,
    iconColor: 'text-danger',
    defaultTitle: 'Network Error',
    defaultMessage: 'Unable to connect to the server. Please check your internet connection and try again.'
  },
  notFound: {
    icon: AlertCircle,
    iconColor: 'text-text-secondary',
    defaultTitle: 'Not Found',
    defaultMessage: 'The requested resource could not be found.'
  }
};

/**
 * ErrorState Component
 * Displays a consistent error state with optional retry functionality
 * 
 * @example
 * // Basic error
 * <ErrorState message="Failed to load data" onRetry={handleRetry} />
 * 
 * @example
 * // Network error
 * <ErrorState variant="network" onRetry={handleRetry} />
 * 
 * @example
 * // Fullscreen error overlay
 * <ErrorState fullscreen variant="error" message="Critical error occurred" />
 */
export function ErrorState({
  variant = 'error',
  title,
  message,
  onRetry,
  fullscreen = false,
  className = '',
  isRetrying = false
}: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto ${className}`}>
      <Icon className={`w-16 h-16 ${config.iconColor}`} strokeWidth={1.5} />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">
          {title || config.defaultTitle}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {message || config.defaultMessage}
        </p>
      </div>
      
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 mt-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/95 backdrop-blur-sm p-6">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * PageErrorState Component
 * Displays an error state centered on the page
 */
export function PageErrorState({
  title,
  message,
  onRetry,
  isRetrying
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
      <ErrorState
        title={title}
        message={message}
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    </div>
  );
}

/**
 * CardErrorState Component
 * Displays an error state within a card
 */
export function CardErrorState({
  message,
  onRetry,
  isRetrying
}: {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-8">
      <ErrorState
        variant="error"
        message={message}
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    </div>
  );
}

/**
 * InlineErrorState Component
 * Displays a compact inline error message
 */
export function InlineErrorState({
  message,
  variant = 'error'
}: {
  message: string;
  variant?: 'error' | 'warning';
}) {
  const Icon = variant === 'error' ? AlertCircle : AlertTriangle;
  const iconColor = variant === 'error' ? 'text-danger' : 'text-warning';
  
  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg ${
      variant === 'error' ? 'bg-danger/10 border border-danger/20' : 'bg-warning/10 border border-warning/20'
    }`}>
      <Icon className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />
      <p className="text-sm text-text-primary">{message}</p>
    </div>
  );
}
