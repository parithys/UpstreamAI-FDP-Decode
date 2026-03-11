import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { onSuccess, onError, immediate = true } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isError: false,
    isSuccess: false,
  });

  const execute = useCallback(async () => {
    setState({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    try {
      const data = await asyncFunction();
      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error as Error;
      setState({
        data: null,
        error: err,
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      onError?.(err);
      throw error;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useAsyncRetry<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> & { maxRetries?: number } = {}
) {
  const { maxRetries = 3, ...asyncOptions } = options;
  const [retryCount, setRetryCount] = useState(0);

  const asyncState = useAsync(asyncFunction, asyncOptions);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      asyncState.execute();
    }
  }, [retryCount, maxRetries, asyncState]);

  return {
    ...asyncState,
    retry,
    retryCount,
    canRetry: retryCount < maxRetries,
  };
}
