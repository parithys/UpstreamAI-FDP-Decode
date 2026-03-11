# Error Handling & Loading States - Standards & Patterns

This document defines the standardized patterns for error handling and loading states across the ADNOC FDP application.

## 📦 Available Components

### Loading States

1. **`LoadingState`** - Generic loading spinner with optional message
2. **`PageLoadingState`** - Full-page centered loading state
3. **`InlineLoadingState`** - Small inline loading indicator
4. **`CardLoadingState`** - Loading state for card components

### Error States

1. **`ErrorState`** - Generic error display with retry
2. **`PageErrorState`** - Full-page centered error state
3. **`InlineErrorState`** - Compact inline error message
4. **`CardErrorState`** - Error state for card components

### Utilities

1. **`useAsyncData`** - Hook for async data fetching with auto error/loading
2. **`ScreenWrapper`** - Component wrapper that handles loading/error states
3. **`simulateAsyncFetch`** - Helper for development/testing

---

## 🎯 Usage Patterns

### Pattern 1: Using `useAsyncData` Hook (Recommended)

**Best for**: Any screen that fetches data on mount

```typescript
import { useAsyncData, simulateAsyncFetch } from '../hooks/useAsyncData';
import { ScreenWrapper } from '../components/ui/screen-wrapper';

export function MyScreen() {
  // Fetch data with automatic loading/error handling
  const { data, isLoading, error, refetch } = useAsyncData(
    async () => {
      // Replace with real API call
      return simulateAsyncFetch(
        { items: [...] },
        1000  // 1 second delay
      );
    },
    {
      enabled: true,  // Auto-fetch on mount
      onSuccess: (data) => {
        toast.success('Data loaded successfully');
      },
      onError: (error) => {
        console.error('Failed to load data:', error);
      }
    }
  );

  return (
    <ScreenWrapper
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading screen data..."
    >
      <div className="min-h-screen bg-background-primary">
        <div className="p-8">
          <h1>My Screen</h1>
          {/* Render your content with data */}
          {data && <div>{/* ... */}</div>}
        </div>
      </div>
    </ScreenWrapper>
  );
}
```

---

### Pattern 2: Manual State Management

**Best for**: Screens with complex interactions or multiple data sources

```typescript
import { useState } from 'react';
import { PageLoadingState } from '../components/ui/loading-state';
import { PageErrorState } from '../components/ui/error-state';

export function MyScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with real API call
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return <PageLoadingState message="Loading data..." />;
  }

  // Show error state
  if (error) {
    return (
      <PageErrorState
        message={error.message}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Your content */}
    </div>
  );
}
```

---

### Pattern 3: Inline Loading/Error (Cards, Sections)

**Best for**: Loading states within specific sections of a page

```typescript
import { CardLoadingState } from '../components/ui/loading-state';
import { CardErrorState } from '../components/ui/error-state';

export function DataCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCardData);

  if (isLoading) {
    return <CardLoadingState message="Loading card data..." />;
  }

  if (error) {
    return (
      <CardErrorState
        message="Failed to load card data"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-6">
      {/* Card content */}
    </div>
  );
}
```

---

### Pattern 4: Action Loading States (Buttons)

**Best for**: Button actions like export, validate, sync

```typescript
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function ActionButton() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    setIsProcessing(true);
    
    toast.info('Processing...', {
      description: 'This may take a few moments'
    });

    try {
      // Perform action
      await performAction();
      
      toast.success('Action completed', {
        description: 'Operation completed successfully'
      });
    } catch (error) {
      toast.error('Action failed', {
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleAction}
      disabled={isProcessing}
      className="flex items-center gap-2"
    >
      {isProcessing ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Process Action
        </>
      )}
    </Button>
  );
}
```

---

## 🎨 Component API Reference

### LoadingState

```typescript
<LoadingState
  size="sm" | "md" | "lg" | "xl"  // Default: "md"
  message="Loading..."              // Optional message
  fullscreen={false}                // Show as overlay
  className=""                      // Custom classes
/>
```

### ErrorState

```typescript
<ErrorState
  variant="error" | "warning" | "network" | "notFound"  // Default: "error"
  title="Custom Title"              // Override default title
  message="Error message"           // Error details
  onRetry={() => {}}                // Retry callback
  fullscreen={false}                // Show as overlay
  isRetrying={false}                // Show retry in progress
  className=""                      // Custom classes
/>
```

### useAsyncData

```typescript
const {
  data,        // Fetched data (null if loading/error)
  isLoading,   // True during fetch
  error,       // Error object if failed
  isError,     // True if error occurred
  isSuccess,   // True if successful
  refetch,     // Function to retry
  reset        // Function to reset state
} = useAsyncData(
  async () => { /* fetch function */ },
  {
    enabled: true,              // Auto-fetch on mount
    onSuccess: (data) => {},    // Success callback
    onError: (error) => {},     // Error callback
    refetchInterval: 0          // Auto-refetch interval (ms)
  }
);
```

### ScreenWrapper

```typescript
<ScreenWrapper
  isLoading={isLoading}
  error={error}
  onRetry={refetch}
  loadingMessage="Loading..."
  errorTitle="Error Title"
  errorMessage="Error message"
  isRetrying={isRetrying}
>
  {/* Your content */}
</ScreenWrapper>
```

---

## 🎭 Error Variants

### 1. General Error (default)
- Red X icon
- "Something Went Wrong"
- Use for unexpected errors

### 2. Network Error
- WiFi Off icon
- "Network Error"
- Use for connection failures

### 3. Warning
- Warning triangle icon
- Yellow color
- Use for non-critical issues

### 4. Not Found
- Alert icon
- Gray color
- Use for missing resources

---

## 🔄 Retry Patterns

### Automatic Retry (useAsyncData)

```typescript
const { data, isLoading, error, refetch } = useAsyncData(
  fetchData,
  {
    onError: (error) => {
      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(refetch, 2000);
        setRetryCount(prev => prev + 1);
      }
    }
  }
);
```

### Manual Retry with Confirmation

```typescript
const handleRetry = async () => {
  const confirmed = await confirm({
    title: 'Retry Operation',
    message: 'Do you want to retry loading the data?'
  });

  if (confirmed) {
    refetch();
  }
};
```

---

## 📝 Toast Notification Standards

### Info
```typescript
toast.info('Operation started', {
  description: 'Processing your request...'
});
```

### Success
```typescript
toast.success('Operation completed', {
  description: 'Data loaded successfully',
  duration: 3000
});
```

### Error
```typescript
toast.error('Operation failed', {
  description: error.message,
  duration: 5000
});
```

### Warning
```typescript
toast.warning('Warning', {
  description: 'Some data may be incomplete'
});
```

---

## ✅ Migration Checklist

When updating a screen to use standardized error/loading:

- [ ] Import `useAsyncData` or loading/error components
- [ ] Replace manual loading state with `PageLoadingState`
- [ ] Replace manual error handling with `PageErrorState` or `ErrorState`
- [ ] Add retry functionality with `onRetry` callback
- [ ] Use `ScreenWrapper` for automatic state handling
- [ ] Add toast notifications for user feedback
- [ ] Test loading state (simulate delay)
- [ ] Test error state (force error)
- [ ] Test retry functionality
- [ ] Add loading indicators to action buttons
- [ ] Ensure consistent error messages

---

## 🎯 Best Practices

### DO ✅

1. **Use ScreenWrapper for full screens**
   ```typescript
   return (
     <ScreenWrapper isLoading={isLoading} error={error} onRetry={refetch}>
       {/* content */}
     </ScreenWrapper>
   );
   ```

2. **Provide clear loading messages**
   ```typescript
   <LoadingState message="Loading production data..." />
   ```

3. **Always offer retry on errors**
   ```typescript
   <ErrorState message={error.message} onRetry={refetch} />
   ```

4. **Use toast for operation feedback**
   ```typescript
   toast.success('Export completed');
   ```

5. **Disable buttons during processing**
   ```typescript
   <Button disabled={isProcessing}>
     {isProcessing ? 'Processing...' : 'Process'}
   </Button>
   ```

### DON'T ❌

1. **Don't show raw error objects to users**
   ```typescript
   // BAD
   <div>{JSON.stringify(error)}</div>
   
   // GOOD
   <ErrorState message="Failed to load data. Please try again." />
   ```

2. **Don't leave loading states without messages**
   ```typescript
   // BAD
   <LoadingState />
   
   // GOOD
   <LoadingState message="Loading..." />
   ```

3. **Don't forget to handle edge cases**
   ```typescript
   // BAD - No loading/error handling
   return <div>{data.items.map(...)}</div>
   
   // GOOD
   if (isLoading) return <PageLoadingState />;
   if (error) return <PageErrorState error={error} onRetry={refetch} />;
   return <div>{data?.items?.map(...) || 'No items'}</div>
   ```

4. **Don't mix loading patterns**
   - Choose ONE pattern per screen and stick with it

5. **Don't forget cleanup**
   ```typescript
   // Use useAsyncData - it handles cleanup automatically
   const { data, isLoading } = useAsyncData(fetchData);
   ```

---

## 🔧 Development Utilities

### Simulate Loading

```typescript
import { simulateAsyncFetch } from '../hooks/useAsyncData';

const { data, isLoading } = useAsyncData(
  () => simulateAsyncFetch({ items: [...] }, 2000)  // 2 second delay
);
```

### Simulate Error

```typescript
const { error, isError } = useAsyncData(
  () => simulateAsyncFetch({ items: [...] }, 1000, true)  // Force error
);
```

### Toggle Loading/Error for Testing

```typescript
// Add to development tools
const [forceLoading, setForceLoading] = useState(false);
const [forceError, setForceError] = useState(false);

if (forceLoading) return <PageLoadingState />;
if (forceError) return <PageErrorState message="Test error" />;
```

---

## 📊 Examples by Screen Type

### Dashboard/Overview Screens
- Use `PageLoadingState` for initial load
- Use `CardLoadingState` for individual cards if lazy-loaded
- Show partial data if some sections load faster

### Detail Screens
- Use `PageLoadingState` for full data
- Use `InlineErrorState` for specific section errors
- Provide clear context in error messages

### Action-Heavy Screens
- Button loading states with spinners
- Toast notifications for all actions
- Confirmation dialogs for destructive actions

### Data-Heavy Screens
- Progressive loading (show sections as ready)
- Skeleton loaders for tables (optional enhancement)
- Clear progress indicators for large operations

---

## 🎓 Implementation Priority

### High Priority (Complete First)
1. ✅ Main dashboard screens (ExecutiveDashboard, Dashboard)
2. ✅ Data-critical screens (DataHealth, HistoryMatching)
3. ✅ User-facing workflows (Insights, Uncertainty)

### Medium Priority
4. Detail screens (StaticModel, WellData, etc.)
5. Settings and configuration screens
6. Governance and audit screens

### Low Priority
7. Admin/management screens
8. Rarely-used utility screens

---

## 📚 Related Files

- `/src/app/components/ui/loading-state.tsx` - Loading components
- `/src/app/components/ui/error-state.tsx` - Error components
- `/src/app/hooks/useAsyncData.ts` - Async data hook
- `/src/app/components/ui/screen-wrapper.tsx` - Screen wrapper
- `/ERROR_LOADING_STANDARDS.md` - This document

---

**Last Updated**: February 2026  
**Status**: ✅ Production Ready
