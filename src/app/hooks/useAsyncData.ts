import { useState, useEffect, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

export interface UseAsyncDataReturn<T> extends AsyncState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

export interface UseAsyncDataOptions {
  /**
   * Whether to fetch data immediately on mount
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Callback when data is successfully loaded
   */
  onSuccess?: (data: any) => void;
  
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  
  /**
   * Refetch interval in milliseconds (0 to disable)
   * @default 0
   */
  refetchInterval?: number;
}

/**
 * Custom hook for handling async data fetching with loading and error states
 * 
 * @example
 * const { data, isLoading, error, refetch } = useAsyncData(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   { enabled: true }
 * );
 * 
 * @param fetchFn - Async function that fetches the data
 * @param options - Configuration options
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions = {}
): UseAsyncDataReturn<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    refetchInterval = 0
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: false
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false
    }));

    try {
      const result = await fetchFn();
      
      setState({
        data: result,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      
      setState({
        data: null,
        isLoading: false,
        error,
        isError: true,
        isSuccess: false
      });

      if (onError) {
        onError(error);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: false
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0 && enabled) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [refetchInterval, enabled, fetchData]);

  return {
    ...state,
    refetch: fetchData,
    reset
  };
}

/**
 * Simulated async data fetcher with configurable delay
 * Useful for development and testing
 * 
 * @example
 * const { data, isLoading } = useAsyncData(
 *   () => simulateAsyncFetch({ name: 'Test' }, 1000)
 * );
 */
export async function simulateAsyncFetch<T>(
  data: T,
  delayMs: number = 1000,
  shouldFail: boolean = false
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Simulated network error'));
      } else {
        resolve(data);
      }
    }, delayMs);
  });
}
