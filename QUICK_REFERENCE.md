# Error & Loading States - Quick Reference Guide

## 🚀 Quick Start (Copy & Paste)

### Pattern 1: Full Screen with Auto State Management
```typescript
import { useAsyncData } from '../hooks/useAsyncData';
import { ScreenWrapper } from '../components/ui/screen-wrapper';

export function MyScreen() {
  const { data, isLoading, error, refetch } = useAsyncData(
    async () => {
      const res = await fetch('/api/data');
      return res.json();
    }
  );

  return (
    <ScreenWrapper isLoading={isLoading} error={error} onRetry={refetch}>
      <div className="min-h-screen bg-background-primary p-8">
        {/* Your content here */}
      </div>
    </ScreenWrapper>
  );
}
```

### Pattern 2: Action Button with Loading
```typescript
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const [isProcessing, setIsProcessing] = useState(false);

const handleAction = async () => {
  setIsProcessing(true);
  toast.info('Processing...');
  
  try {
    await performAction();
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed', { description: error.message });
  } finally {
    setIsProcessing(false);
  }
};

<Button disabled={isProcessing} onClick={handleAction}>
  {isProcessing ? (
    <>
      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
      Processing...
    </>
  ) : (
    'Process Action'
  )}
</Button>
```

### Pattern 3: Card/Section with Loading
```typescript
import { CardLoadingState } from '../components/ui/loading-state';
import { CardErrorState } from '../components/ui/error-state';

if (isLoading) return <CardLoadingState message="Loading..." />;
if (error) return <CardErrorState message="Failed" onRetry={refetch} />;

return <div className="bg-card p-6">{/* content */}</div>;
```

---

## 📦 Component Cheat Sheet

### Loading Components

| Component | Use Case | Example |
|-----------|----------|---------|
| `<LoadingState />` | Generic loading | `<LoadingState size="md" message="Loading..." />` |
| `<PageLoadingState />` | Full screen | `<PageLoadingState message="Loading data..." />` |
| `<InlineLoadingState />` | Inline text | `<InlineLoadingState message="Saving..." />` |
| `<CardLoadingState />` | Card/section | `<CardLoadingState message="Loading card..." />` |

### Error Components

| Component | Use Case | Example |
|-----------|----------|---------|
| `<ErrorState />` | Generic error | `<ErrorState message="Error" onRetry={fn} />` |
| `<PageErrorState />` | Full screen | `<PageErrorState message="Failed" onRetry={fn} />` |
| `<InlineErrorState />` | Inline message | `<InlineErrorState message="Error text" />` |
| `<CardErrorState />` | Card/section | `<CardErrorState message="Failed" onRetry={fn} />` |

---

## 🎨 Props Reference

### LoadingState Props
```typescript
{
  size?: 'sm' | 'md' | 'lg' | 'xl';     // Default: 'md'
  message?: string;                      // Optional text
  fullscreen?: boolean;                  // Overlay mode
  className?: string;                    // Custom styles
}
```

### ErrorState Props
```typescript
{
  variant?: 'error' | 'warning' | 'network' | 'notFound';
  title?: string;                        // Custom title
  message?: string;                      // Error details
  onRetry?: () => void;                  // Retry callback
  fullscreen?: boolean;                  // Overlay mode
  isRetrying?: boolean;                  // Show retry state
  className?: string;                    // Custom styles
}
```

### useAsyncData Options
```typescript
{
  enabled?: boolean;                     // Auto-fetch (default: true)
  onSuccess?: (data) => void;            // Success callback
  onError?: (error) => void;             // Error callback
  refetchInterval?: number;              // Auto-refresh (ms)
}
```

### ScreenWrapper Props
```typescript
{
  children: ReactNode;                   // Content to render
  isLoading?: boolean;                   // Loading state
  error?: Error | null;                  // Error object
  onRetry?: () => void;                  // Retry callback
  loadingMessage?: string;               // Custom loading text
  errorTitle?: string;                   // Custom error title
  errorMessage?: string;                 // Custom error text
  isRetrying?: boolean;                  // Retry in progress
}
```

---

## 🎯 Common Scenarios

### Scenario 1: Fetch on Page Load
```typescript
const { data, isLoading, error, refetch } = useAsyncData(
  async () => {
    const res = await fetch('/api/data');
    return res.json();
  }
);
```

### Scenario 2: Manual Trigger (Button Click)
```typescript
const { data, isLoading, error, refetch } = useAsyncData(
  fetchData,
  { enabled: false }  // Don't auto-fetch
);

<Button onClick={refetch}>Load Data</Button>
```

### Scenario 3: Periodic Refresh
```typescript
const { data } = useAsyncData(
  fetchData,
  { refetchInterval: 5000 }  // Refresh every 5 seconds
);
```

### Scenario 4: With Success/Error Callbacks
```typescript
const { data } = useAsyncData(
  fetchData,
  {
    onSuccess: (data) => {
      toast.success('Data loaded!');
      console.log('Loaded:', data);
    },
    onError: (error) => {
      toast.error('Failed to load');
      console.error('Error:', error);
    }
  }
);
```

---

## 🔄 Toast Notification Templates

### Info
```typescript
toast.info('Title', {
  description: 'Description text'
});
```

### Success
```typescript
toast.success('Operation completed', {
  description: 'Additional details',
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
toast.warning('Warning title', {
  description: 'Warning details'
});
```

### Loading (Persistent)
```typescript
const toastId = toast.loading('Processing...', {
  description: 'This may take a moment'
});

// Later, dismiss it
toast.dismiss(toastId);

// Or update it
toast.success('Complete!', { id: toastId });
```

---

## 🎭 Error Variant Guide

| Variant | Icon | Color | Use For |
|---------|------|-------|---------|
| `error` | ❌ | Red | General errors, unexpected failures |
| `warning` | ⚠️ | Amber | Non-critical issues, warnings |
| `network` | 📡 | Red | Connection failures, timeout errors |
| `notFound` | ℹ️ | Gray | Missing resources, 404 errors |

### Usage
```typescript
// Network error
<ErrorState variant="network" onRetry={refetch} />

// Warning
<ErrorState variant="warning" message="Data may be incomplete" />

// Not found
<ErrorState variant="notFound" message="Resource not found" />
```

---

## ⚡ Performance Tips

### 1. Disable Auto-Fetch When Not Needed
```typescript
// ❌ Fetches immediately even if tab is hidden
const { data } = useAsyncData(fetchData);

// ✅ Only fetch when user opens the tab
const { data, refetch } = useAsyncData(fetchData, { enabled: false });
useEffect(() => {
  if (isTabVisible) refetch();
}, [isTabVisible]);
```

### 2. Debounce Frequent Refetches
```typescript
// ❌ Fetches on every keystroke
<Input onChange={() => refetch()} />

// ✅ Debounced fetch
const debouncedRefetch = debounce(refetch, 500);
<Input onChange={debouncedRefetch} />
```

### 3. Cancel Stale Requests
```typescript
const { data, refetch } = useAsyncData(
  async () => {
    const controller = new AbortController();
    const res = await fetch('/api/data', {
      signal: controller.signal
    });
    return res.json();
  }
);
```

---

## ✅ Checklist for New Screens

When implementing a new screen:

- [ ] Import `useAsyncData` hook
- [ ] Import `ScreenWrapper` or loading/error components
- [ ] Replace manual loading state with standard components
- [ ] Add error handling with retry
- [ ] Add toast notifications for user actions
- [ ] Test loading state (simulate delay)
- [ ] Test error state (force error)
- [ ] Test retry functionality
- [ ] Verify keyboard navigation
- [ ] Check mobile responsiveness

---

## 🐛 Debugging Guide

### Problem: Loading state never ends
```typescript
// Check: Is the async function returning?
const { data, isLoading } = useAsyncData(
  async () => {
    const res = await fetch('/api/data');
    return res.json();  // ← Make sure to return!
  }
);
```

### Problem: Error state not showing
```typescript
// Check: Is error being thrown properly?
try {
  const res = await fetch('/api/data');
  if (!res.ok) {
    throw new Error('API request failed');  // ← Throw error!
  }
  return res.json();
} catch (error) {
  throw error;  // ← Re-throw to be caught by useAsyncData
}
```

### Problem: Retry not working
```typescript
// Check: Is onRetry passed to error component?
<ErrorState
  message={error.message}
  onRetry={refetch}  // ← Must pass refetch function
/>
```

### Problem: Toast not appearing
```typescript
// Check: Is Toaster component in root?
// App.tsx should have:
import { Toaster } from 'sonner';

<Toaster position="top-right" />
```

---

## 📱 Responsive Considerations

### Mobile Loading States
```typescript
// Desktop: Full spinner with message
<LoadingState size="lg" message="Loading production data..." />

// Mobile: Smaller spinner
<LoadingState size="md" message="Loading..." />
```

### Touch-Friendly Retry Buttons
```typescript
// Ensure buttons are large enough for touch
<Button
  onClick={onRetry}
  className="min-h-[44px] min-w-[44px]"  // iOS guidelines
>
  Retry
</Button>
```

---

## 🎨 Styling Customization

### Custom Loading Spinner Color
```typescript
<LoadingState
  className="[&_.lucide-loader-2]:text-warning"  // Yellow spinner
  message="Processing..."
/>
```

### Custom Error Background
```typescript
<ErrorState
  className="bg-gradient-to-r from-danger/5 to-danger/10"
  message="Critical error"
/>
```

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `/src/app/components/ui/loading-state.tsx` | Loading components |
| `/src/app/components/ui/error-state.tsx` | Error components |
| `/src/app/hooks/useAsyncData.ts` | Async data hook |
| `/src/app/components/ui/screen-wrapper.tsx` | Screen wrapper |
| `/ERROR_LOADING_STANDARDS.md` | Full documentation |
| `/IMPLEMENTATION_SUMMARY.md` | Implementation details |
| `/QUICK_REFERENCE.md` | This file |

---

## 💡 Pro Tips

### 1. Combine Multiple States
```typescript
const user = useAsyncData(fetchUser);
const posts = useAsyncData(fetchPosts);

// Show loading if ANY is loading
const isLoading = user.isLoading || posts.isLoading;

// Show error if ANY has error
const error = user.error || posts.error;
```

### 2. Optimistic Updates
```typescript
const handleUpdate = async (newData) => {
  // Update UI immediately
  setLocalData(newData);
  
  try {
    // Then sync with server
    await updateServer(newData);
    toast.success('Updated!');
  } catch (error) {
    // Revert on error
    setLocalData(oldData);
    toast.error('Update failed');
  }
};
```

### 3. Global Loading Indicator
```typescript
// Create a global loading context
const LoadingContext = createContext();

// Track all active requests
const [activeRequests, setActiveRequests] = useState(0);

// Show global loader when > 0 requests
{activeRequests > 0 && <GlobalLoadingBar />}
```

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: February 13, 2026  
**Print this page for easy access!** 📄
