import { AlertTriangle, RefreshCw, WifiOff, Database, ServerCrash } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'generic' | 'network' | 'data' | 'server';
  className?: string;
  fullScreen?: boolean;
}

const errorConfig = {
  generic: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
  },
  network: {
    icon: WifiOff,
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
  data: {
    icon: Database,
    title: 'Data Load Failed',
    message: 'Unable to load the requested data. Please try again.',
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
  },
  server: {
    icon: ServerCrash,
    title: 'Server Error',
    message: 'The server encountered an error. Our team has been notified.',
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
  },
};

export function ErrorState({
  title,
  message,
  onRetry,
  type = 'generic',
  className,
  fullScreen = false,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  const content = (
    <div className={cn('text-center', className)}>
      <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', config.bgColor)}>
        <Icon className={cn('w-8 h-8', config.color)} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
        {message || config.message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export function ErrorCard({
  title,
  message,
  onRetry,
  type = 'generic',
}: ErrorStateProps) {
  return (
    <div className="bg-card rounded-lg border border-card-border shadow-glow p-12">
      <ErrorState
        title={title}
        message={message}
        onRetry={onRetry}
        type={type}
      />
    </div>
  );
}
