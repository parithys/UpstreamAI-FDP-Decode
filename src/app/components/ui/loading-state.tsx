import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  /**
   * Size variant of the loading spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  
  /**
   * Whether to show the loading state in fullscreen mode
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * Custom className for additional styling
   */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

/**
 * LoadingState Component
 * Displays a consistent loading spinner with optional message
 * 
 * @example
 * // Small inline loading
 * <LoadingState size="sm" />
 * 
 * @example
 * // Medium loading with message
 * <LoadingState message="Loading data..." />
 * 
 * @example
 * // Fullscreen loading overlay
 * <LoadingState fullscreen message="Processing..." />
 */
export function LoadingState({
  size = 'md',
  message,
  fullscreen = false,
  className = ''
}: LoadingStateProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} text-primary animate-spin`} 
        strokeWidth={2.5}
      />
      {message && (
        <p className={`${textSizeClasses[size]} text-text-secondary animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * PageLoadingState Component
 * Displays a loading state centered on the page
 */
export function PageLoadingState({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <LoadingState size="lg" message={message || 'Loading...'} />
    </div>
  );
}

/**
 * InlineLoadingState Component
 * Displays a small inline loading state
 */
export function InlineLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-text-secondary">
      <Loader2 className="w-4 h-4 animate-spin" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}

/**
 * CardLoadingState Component
 * Displays a loading state within a card
 */
export function CardLoadingState({ message }: { message?: string }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-8">
      <LoadingState size="md" message={message || 'Loading...'} />
    </div>
  );
}
