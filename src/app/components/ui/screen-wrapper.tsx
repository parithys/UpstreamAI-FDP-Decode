import { ReactNode } from 'react';
import { PageLoadingState } from './loading-state';
import { PageErrorState } from './error-state';

interface ScreenWrapperProps {
  /**
   * Content to render when not loading/error
   */
  children: ReactNode;
  
  /**
   * Whether data is currently loading
   */
  isLoading?: boolean;
  
  /**
   * Error object if an error occurred
   */
  error?: Error | null;
  
  /**
   * Callback to retry failed operation
   */
  onRetry?: () => void;
  
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  
  /**
   * Custom error title
   */
  errorTitle?: string;
  
  /**
   * Custom error message (overrides error.message)
   */
  errorMessage?: string;
  
  /**
   * Whether retry is in progress
   */
  isRetrying?: boolean;
}

/**
 * ScreenWrapper Component
 * Wraps screen content and handles loading/error states automatically
 * 
 * @example
 * export function MyScreen() {
 *   const { data, isLoading, error, refetch } = useAsyncData(fetchData);
 *   
 *   return (
 *     <ScreenWrapper
 *       isLoading={isLoading}
 *       error={error}
 *       onRetry={refetch}
 *       loadingMessage="Loading screen data..."
 *     >
 *       <div>{data && renderContent(data)}</div>
 *     </ScreenWrapper>
 *   );
 * }
 */
export function ScreenWrapper({
  children,
  isLoading = false,
  error = null,
  onRetry,
  loadingMessage,
  errorTitle,
  errorMessage,
  isRetrying = false
}: ScreenWrapperProps) {
  // Show loading state
  if (isLoading) {
    return <PageLoadingState message={loadingMessage} />;
  }

  // Show error state
  if (error) {
    return (
      <PageErrorState
        title={errorTitle}
        message={errorMessage || error.message}
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    );
  }

  // Show content
  return <>{children}</>;
}
