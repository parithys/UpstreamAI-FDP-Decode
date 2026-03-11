# Confirmation Dialogs - Complete Guide

> **Production-ready confirmation dialog system for ADNOC FDP**  
> Two approaches: Context-based (recommended) and Standalone components

---

## 📚 Overview

The ADNOC FDP application provides two ways to implement confirmation dialogs:

1. **Context-based** (Recommended) - Using `useConfirmation` hook
2. **Standalone** - Using standalone dialog components

Both approaches support 4 variants: `info`, `success`, `warning`, `danger`

---

## 🎯 Quick Start

### Approach 1: Context-based (Recommended)

**Best for**: Most use cases, cleaner code, automatic state management

```typescript
import { useConfirmation } from '../context/ConfirmationContext';
import { toast } from 'sonner';

export function MyComponent() {
  const { confirm, confirmDanger, confirmWarning, confirmSuccess } = useConfirmation();

  const handleDelete = async () => {
    const confirmed = await confirmDanger({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      // User clicked "Delete"
      await deleteItem();
      toast.success('Item deleted successfully');
    } else {
      // User clicked "Cancel" or closed dialog
      toast.info('Deletion cancelled');
    }
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Approach 2: Standalone Component

**Best for**: Custom dialog positioning, special use cases, dialog-heavy components

```typescript
import { useState } from 'react';
import { SimpleConfirmationDialog } from '../components/ui/confirmation-dialog';

export function MyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deleteItem();
    setIsDialogOpen(false);
    toast.success('Item deleted');
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Delete</Button>
      
      <SimpleConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
```

---

## 📦 Available Components & Hooks

### Context-based API

| Method | Description | Use Case |
|--------|-------------|----------|
| `confirm()` | General confirmation | Default confirmations |
| `confirmDanger()` | Danger/destructive action | Delete, remove, reject |
| `confirmWarning()` | Warning confirmation | Potential issues, overwrite |
| `confirmSuccess()` | Success confirmation | Approve, accept, finalize |

### Standalone Components

| Component | Description |
|-----------|-------------|
| `SimpleConfirmationDialog` | Base dialog with all variants |
| `DangerConfirmationDialog` | Pre-configured danger variant |
| `WarningConfirmationDialog` | Pre-configured warning variant |
| `SuccessConfirmationDialog` | Pre-configured success variant |
| `InfoConfirmationDialog` | Pre-configured info variant |

---

## 🎨 Variants & Usage

### 1. Danger Variant (Red)

**Use for**: Destructive actions, deletions, irreversible changes

```typescript
// Context-based
const confirmed = await confirmDanger({
  title: 'Delete Field Data',
  message: 'This will permanently delete all production data for Field Alpha.',
  details: 'This action cannot be undone. All associated reports will also be removed.',
  confirmLabel: 'Delete Permanently',
  cancelLabel: 'Keep Data'
});

// Standalone
<DangerConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Field Data"
  message="This will permanently delete all production data."
  onConfirm={handleDelete}
/>
```

**Visual**: Red icon, red confirm button, destructive appearance

---

### 2. Warning Variant (Amber)

**Use for**: Potentially problematic actions, overwrite confirmations

```typescript
// Context-based
const confirmed = await confirmWarning({
  title: 'Overwrite Existing Data',
  message: 'This will replace the current simulation results with new data.',
  details: 'The previous results will be moved to history.',
  confirmLabel: 'Overwrite',
  cancelLabel: 'Cancel'
});

// Standalone
<WarningConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Overwrite Existing Data"
  message="This will replace current simulation results."
  onConfirm={handleOverwrite}
/>
```

**Visual**: Amber icon, yellow confirm button, cautionary appearance

---

### 3. Success Variant (Green)

**Use for**: Approvals, finalizations, positive confirmations

```typescript
// Context-based
const confirmed = await confirmSuccess({
  title: 'Approve FDP',
  message: 'Are you sure you want to approve this Field Development Plan?',
  details: 'All stakeholders will be notified of your approval.',
  confirmLabel: 'Approve',
  cancelLabel: 'Review Again'
});

// Standalone
<SuccessConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Approve FDP"
  message="Confirm approval of this Field Development Plan?"
  onConfirm={handleApprove}
/>
```

**Visual**: Green icon, primary confirm button, positive appearance

---

### 4. Info Variant (Blue)

**Use for**: General confirmations, informational dialogs

```typescript
// Context-based
const confirmed = await confirm({
  title: 'Export Data',
  message: 'Export production history data to Excel format?',
  confirmLabel: 'Export',
  cancelLabel: 'Cancel',
  type: 'info'
});

// Standalone
<InfoConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Export Data"
  message="Export production history to Excel?"
  onConfirm={handleExport}
/>
```

**Visual**: Blue icon, primary confirm button, neutral appearance

---

## 🔧 Configuration Options

### Full API Reference

```typescript
interface ConfirmationConfig {
  // Required
  title: string;                    // Dialog title
  message: string;                  // Main message
  
  // Actions
  onConfirm: () => void | Promise<void>;  // Confirm callback
  onCancel?: () => void;                  // Cancel callback (optional)
  
  // Labels
  confirmLabel?: string;            // Default: 'Confirm'
  cancelLabel?: string;             // Default: 'Cancel'
  
  // Appearance
  type?: 'info' | 'success' | 'warning' | 'danger';  // Default: 'info'
  showIcon?: boolean;               // Default: true
  isDangerous?: boolean;            // Force red button (danger only)
  
  // Content
  details?: string;                 // Additional details below message
  
  // Behavior
  showLoadingState?: boolean;       // Default: true
  canDismiss?: boolean;             // Default: true (ESC, outside click)
  
  // Standalone only
  isOpen?: boolean;                 // Dialog open state
  onClose?: () => void;             // Close callback
  className?: string;               // Custom styles
}
```

---

## 💡 Usage Patterns

### Pattern 1: Simple Confirmation

```typescript
const handleAction = async () => {
  const confirmed = await confirm({
    title: 'Confirm Action',
    message: 'Do you want to proceed?'
  });

  if (confirmed) {
    // Proceed
  }
};
```

---

### Pattern 2: With Action Callback

```typescript
const handleAction = async () => {
  await confirmDanger({
    title: 'Delete Item',
    message: 'Are you sure?',
    onConfirm: async () => {
      // This runs when user clicks "Confirm"
      await deleteItem();
      toast.success('Deleted');
    }
  });
  
  // Dialog is closed here, whether confirmed or cancelled
};
```

---

### Pattern 3: With Additional Details

```typescript
const confirmed = await confirmWarning({
  title: 'Overwrite File',
  message: 'A file with this name already exists.',
  details: 'Overwriting will replace the existing file. The original file will be moved to trash and can be recovered for 30 days.',
  confirmLabel: 'Overwrite',
  cancelLabel: 'Keep Both'
});
```

---

### Pattern 4: With Loading State

```typescript
const confirmed = await confirm({
  title: 'Export Data',
  message: 'This will export all production data.',
  showLoadingState: true,  // Shows spinner on confirm button
  onConfirm: async () => {
    // Async operation
    await exportData();
    // Spinner shows automatically during this
  }
});
```

---

### Pattern 5: Non-dismissible (Critical Actions)

```typescript
const confirmed = await confirmDanger({
  title: 'Critical Action',
  message: 'This action requires your explicit confirmation.',
  canDismiss: false,  // Can't close by clicking outside or ESC
  confirmLabel: 'I Understand, Proceed',
  cancelLabel: 'Cancel'
});
```

---

### Pattern 6: Conditional Execution

```typescript
const handleSubmit = async () => {
  // Check if confirmation needed
  const needsConfirmation = hasChanges && !isAutoSave;
  
  if (needsConfirmation) {
    const confirmed = await confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Save before leaving?',
      confirmLabel: 'Save',
      cancelLabel: 'Discard'
    });
    
    if (!confirmed) {
      return; // User chose to discard
    }
  }
  
  await saveChanges();
};
```

---

## 🎯 Real-World Examples

### Example 1: Delete Confirmation with Data

```typescript
export function DataHealthCard({ item }: { item: DataItem }) {
  const { confirmDanger } = useConfirmation();
  
  const handleDelete = async () => {
    const confirmed = await confirmDanger({
      title: `Delete ${item.name}`,
      message: `Are you sure you want to delete "${item.name}"?`,
      details: `This will remove ${item.recordCount} records from the database. This action cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      cancelLabel: 'Keep Data'
    });
    
    if (confirmed) {
      try {
        await api.deleteItem(item.id);
        toast.success(`${item.name} deleted successfully`);
        refetchData();
      } catch (error) {
        toast.error('Failed to delete item', {
          description: error.message
        });
      }
    }
  };
  
  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
}
```

---

### Example 2: Approval Workflow

```typescript
export function DecisionQueue() {
  const { confirmSuccess, confirmDanger } = useConfirmation();
  
  const handleApprove = async (decision: Decision) => {
    const confirmed = await confirmSuccess({
      title: 'Approve Decision',
      message: `Approve "${decision.item}"?`,
      details: 'This will notify all stakeholders and finalize the approval.',
      confirmLabel: 'Approve',
      cancelLabel: 'Review Again'
    });
    
    if (confirmed) {
      await api.approve(decision.id);
      toast.success('Decision approved');
      addNotification({
        type: 'success',
        title: 'Decision Approved',
        message: `${decision.item} has been approved`
      });
    }
  };
  
  const handleReject = async (decision: Decision) => {
    const confirmed = await confirmDanger({
      title: 'Reject Decision',
      message: `Reject "${decision.item}"?`,
      details: 'This will send the item back for revision.',
      confirmLabel: 'Reject',
      cancelLabel: 'Cancel'
    });
    
    if (confirmed) {
      await api.reject(decision.id);
      toast.warning('Decision rejected');
    }
  };
  
  return (
    <div>
      <Button onClick={() => handleApprove(decision)}>Approve</Button>
      <Button onClick={() => handleReject(decision)}>Reject</Button>
    </div>
  );
}
```

---

### Example 3: Export with Options

```typescript
export function ExportButton() {
  const { confirm } = useConfirmation();
  
  const handleExport = async () => {
    const confirmed = await confirm({
      title: 'Export Production Data',
      message: 'Export all production history to Excel format?',
      details: `This will export ${recordCount} records. Large exports may take a few minutes.`,
      confirmLabel: 'Export',
      cancelLabel: 'Cancel',
      type: 'info',
      showLoadingState: true,
      onConfirm: async () => {
        // This shows loading spinner automatically
        const data = await api.exportData();
        downloadFile(data, 'production-data.xlsx');
        toast.success('Export completed');
      }
    });
  };
  
  return (
    <Button onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Export Data
    </Button>
  );
}
```

---

### Example 4: Overwrite Warning

```typescript
export function FileUpload() {
  const { confirmWarning } = useConfirmation();
  
  const handleUpload = async (file: File) => {
    // Check if file exists
    const exists = await api.checkFileExists(file.name);
    
    if (exists) {
      const confirmed = await confirmWarning({
        title: 'File Already Exists',
        message: `A file named "${file.name}" already exists.`,
        details: 'The existing file will be replaced. This action cannot be undone.',
        confirmLabel: 'Replace',
        cancelLabel: 'Keep Both'
      });
      
      if (!confirmed) {
        // User chose "Keep Both" - rename file
        file = await renameFile(file);
      }
    }
    
    await uploadFile(file);
    toast.success('File uploaded successfully');
  };
  
  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

---

## 🎨 Customization

### Custom Styling (Standalone)

```typescript
<SimpleConfirmationDialog
  isOpen={isOpen}
  onClose={onClose}
  title="Custom Styled Dialog"
  message="This dialog has custom styling"
  variant="danger"
  className="max-w-lg"  // Custom max width
  onConfirm={handleConfirm}
/>
```

### Custom Labels

```typescript
const confirmed = await confirmDanger({
  title: 'Delete All Data',
  message: 'This will delete everything.',
  confirmLabel: 'Yes, Delete Everything',  // Custom confirm
  cancelLabel: 'No, Keep My Data'          // Custom cancel
});
```

### Without Icon

```typescript
const confirmed = await confirm({
  title: 'Simple Question',
  message: 'Do you want to continue?',
  showIcon: false  // No icon shown
});
```

---

## ⚡ Best Practices

### DO ✅

1. **Use descriptive titles**
   ```typescript
   // ✅ GOOD
   confirmDanger({
     title: 'Delete Production Data',
     message: 'Are you sure you want to delete all production data for Field Alpha?'
   });
   
   // ❌ BAD
   confirmDanger({
     title: 'Delete',
     message: 'Are you sure?'
   });
   ```

2. **Provide context in message**
   ```typescript
   // ✅ GOOD
   confirmDanger({
     title: 'Delete Well Data',
     message: 'This will permanently delete data for 12 wells.',
     details: 'Associated logs and test results will also be removed.'
   });
   ```

3. **Use appropriate variant**
   ```typescript
   // ✅ GOOD - Danger for deletions
   await confirmDanger({ title: 'Delete', message: '...' });
   
   // ✅ GOOD - Success for approvals
   await confirmSuccess({ title: 'Approve', message: '...' });
   
   // ✅ GOOD - Warning for overwrites
   await confirmWarning({ title: 'Overwrite', message: '...' });
   ```

4. **Handle both outcomes**
   ```typescript
   // ✅ GOOD
   const confirmed = await confirmDanger({...});
   if (confirmed) {
     await deleteItem();
     toast.success('Deleted');
   } else {
     toast.info('Cancelled');
   }
   ```

5. **Use loading states for async actions**
   ```typescript
   // ✅ GOOD
   await confirm({
     title: 'Export Data',
     message: 'Export to Excel?',
     showLoadingState: true,  // Shows spinner
     onConfirm: async () => {
       await longRunningExport();
     }
   });
   ```

### DON'T ❌

1. **Don't use vague messages**
   ```typescript
   // ❌ BAD
   confirm({ title: 'Confirm', message: 'Are you sure?' });
   ```

2. **Don't forget error handling**
   ```typescript
   // ❌ BAD - No error handling
   const confirmed = await confirmDanger({...});
   await deleteItem(); // What if this fails?
   
   // ✅ GOOD
   if (confirmed) {
     try {
       await deleteItem();
       toast.success('Deleted');
     } catch (error) {
       toast.error('Failed to delete');
     }
   }
   ```

3. **Don't nest confirmations**
   ```typescript
   // ❌ BAD
   const confirmed1 = await confirm({...});
   if (confirmed1) {
     const confirmed2 = await confirm({...}); // Confusing!
   }
   
   // ✅ GOOD - Combine into one clear dialog
   const confirmed = await confirm({
     title: 'Delete and Archive',
     message: 'This will delete the item and archive related data.',
     details: 'Both actions will be performed. Continue?'
   });
   ```

4. **Don't use wrong variant**
   ```typescript
   // ❌ BAD - Success for deletion
   await confirmSuccess({ title: 'Delete Item', ... });
   
   // ✅ GOOD - Danger for deletion
   await confirmDanger({ title: 'Delete Item', ... });
   ```

---

## 🔍 Comparison: Context vs Standalone

| Feature | Context-based | Standalone |
|---------|--------------|------------|
| **Setup** | Import hook | Import component + manage state |
| **Code Lines** | Fewer | More |
| **State Management** | Automatic | Manual |
| **Multiple Dialogs** | Easy | Complex |
| **Customization** | Limited | Full control |
| **Positioning** | Fixed | Flexible |
| **Best For** | Most cases | Special needs |

### When to Use Context-based
- ✅ Standard confirmations
- ✅ Quick implementation
- ✅ Consistent behavior
- ✅ Less boilerplate

### When to Use Standalone
- ✅ Custom positioning
- ✅ Multiple simultaneous dialogs
- ✅ Special styling needs
- ✅ Dialog-heavy components

---

## 🎓 Migration from Manual Dialogs

### Before (Manual)
```typescript
const [showDialog, setShowDialog] = useState(false);
const [pendingAction, setPendingAction] = useState(null);

const handleDelete = () => {
  setPendingAction('delete');
  setShowDialog(true);
};

const handleConfirm = async () => {
  if (pendingAction === 'delete') {
    await deleteItem();
  }
  setShowDialog(false);
};

return (
  <>
    <Button onClick={handleDelete}>Delete</Button>
    {showDialog && (
      <div>...</div> // Manual dialog JSX
    )}
  </>
);
```

### After (Context-based)
```typescript
const { confirmDanger } = useConfirmation();

const handleDelete = async () => {
  const confirmed = await confirmDanger({
    title: 'Delete Item',
    message: 'Are you sure?'
  });
  
  if (confirmed) {
    await deleteItem();
  }
};

return <Button onClick={handleDelete}>Delete</Button>;
```

**Benefits**:
- ⚡ **80% less code**
- ⚡ **No state management**
- ⚡ **Cleaner logic**
- ⚡ **Consistent UI**

---

## 📊 Component Status

### Available Now
- ✅ `useConfirmation` hook
- ✅ `confirm()` method
- ✅ `confirmDanger()` method
- ✅ `confirmWarning()` method
- ✅ `confirmSuccess()` method
- ✅ `SimpleConfirmationDialog` component
- ✅ `DangerConfirmationDialog` component
- ✅ `WarningConfirmationDialog` component
- ✅ `SuccessConfirmationDialog` component
- ✅ `InfoConfirmationDialog` component
- ✅ Loading states
- ✅ ESC key handling
- ✅ Click outside to dismiss
- ✅ Keyboard accessibility
- ✅ Screen reader support

### Features
- ✅ 4 variants (info, success, warning, danger)
- ✅ Loading states on confirm
- ✅ Async action support
- ✅ Optional details field
- ✅ Custom labels
- ✅ Dismissible/non-dismissible
- ✅ Icon display toggle
- ✅ TypeScript types
- ✅ Accessibility compliant
- ✅ ADNOC brand colors

---

## 🚀 Quick Reference

### Context-based (Recommended)

```typescript
import { useConfirmation } from '../context/ConfirmationContext';

const { confirm, confirmDanger, confirmWarning, confirmSuccess } = useConfirmation();

// General
await confirm({ title: '...', message: '...' });

// Danger (delete, remove)
await confirmDanger({ title: '...', message: '...' });

// Warning (overwrite, potential issues)
await confirmWarning({ title: '...', message: '...' });

// Success (approve, finalize)
await confirmSuccess({ title: '...', message: '...' });
```

### Standalone

```typescript
import { SimpleConfirmationDialog } from '../components/ui/confirmation-dialog';

<SimpleConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="..."
  message="..."
  variant="danger"  // or 'warning' | 'success' | 'info'
  onConfirm={handleConfirm}
/>
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `/src/app/context/ConfirmationContext.tsx` | Context provider & hook |
| `/src/app/components/ConfirmationDialog.tsx` | Context dialog component |
| `/src/app/components/ui/confirmation-dialog.tsx` | Standalone components |
| `/CONFIRMATION_DIALOGS_GUIDE.md` | This documentation |

---

**Status**: ✅ Production Ready  
**Last Updated**: February 13, 2026  
**Version**: 1.0.0
