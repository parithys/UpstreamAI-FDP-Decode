import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingCard({ text }: { text?: string }) {
  return (
    <div className="bg-card rounded-lg border border-card-border shadow-glow p-12">
      <LoadingSpinner size="lg" text={text || 'Loading...'} />
    </div>
  );
}

export function LoadingScreen({ text }: { text?: string }) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
        </div>
        <p className="text-lg text-text-primary font-medium mb-2">
          {text || 'Loading'}
        </p>
        <p className="text-sm text-text-secondary">
          Please wait while we prepare your data...
        </p>
      </div>
    </div>
  );
}
