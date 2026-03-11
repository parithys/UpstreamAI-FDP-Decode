# Confirmation Dialogs - Quick Reference

## 🚀 Quick Start (Copy & Paste)

### Delete Confirmation
```typescript
import { useConfirmation } from '../context/ConfirmationContext';

const { confirmDanger } = useConfirmation();

const handleDelete = async () => {
  const confirmed = await confirmDanger({
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  });

  if (confirmed) {
    await deleteItem();
    toast.success('Deleted successfully');
  }
};
```

### Approval Confirmation
```typescript
const { confirmSuccess } = useConfirmation();

const handleApprove = async () => {
  const confirmed = await confirmSuccess({
    title: 'Approve FDP',
    message: 'Are you sure you want to approve this Field Development Plan?',
    confirmLabel: 'Approve',
    cancelLabel: 'Review Again'
  });

  if (confirmed) {
    await approveFDP();
    toast.success('FDP approved');
  }
};
```

### Warning Confirmation
```typescript
const { confirmWarning } = useConfirmation();

const handleOverwrite = async () => {
  const confirmed = await confirmWarning({
    title: 'Overwrite Data',
    message: 'This will replace existing simulation results.',
    details: 'Previous results will be moved to history.',
    confirmLabel: 'Overwrite',
    cancelLabel: 'Cancel'
  });

  if (confirmed) {
    await overwriteData();
  }
};
```

### General Confirmation
```typescript
const { confirm } = useConfirmation();

const handleExport = async () => {
  const confirmed = await confirm({
    title: 'Export Data',
    message: 'Export production history to Excel?',
    type: 'info'
  });

  if (confirmed) {
    await exportData();
  }
};
```

---

## 📦 Methods Cheat Sheet

| Method | Use For | Color | Example |
|--------|---------|-------|---------|
| `confirmDanger()` | Delete, Remove, Reject | Red | Delete item, Remove user |
| `confirmWarning()` | Overwrite, Replace | Amber | Overwrite file, Replace data |
| `confirmSuccess()` | Approve, Accept, Finalize | Green | Approve FDP, Accept changes |
| `confirm()` | General confirmations | Blue | Export, Save, Continue |

---

## 🎨 All Options

```typescript
await confirm({
  // Required
  title: 'Dialog Title',
  message: 'Main message text',
  
  // Optional
  details: 'Additional details (small text)',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  type: 'info' | 'success' | 'warning' | 'danger',
  showIcon: true,
  showLoadingState: true,
  canDismiss: true,
  
  // Callbacks (optional)
  onConfirm: async () => {
    // Runs when user clicks confirm
  },
  onCancel: () => {
    // Runs when user clicks cancel
  }
});
```

---

## 💡 Common Patterns

### Pattern 1: With Loading State
```typescript
await confirmDanger({
  title: 'Delete All',
  message: 'Delete all items?',
  showLoadingState: true,  // Shows spinner
  onConfirm: async () => {
    await deleteAllItems();  // Spinner shows during this
  }
});
```

### Pattern 2: With Details
```typescript
await confirmDanger({
  title: 'Delete Field Data',
  message: 'This will delete all production data.',
  details: '12 wells, 487 records. This cannot be undone.',
  confirmLabel: 'Delete Permanently'
});
```

### Pattern 3: Non-dismissible
```typescript
await confirmDanger({
  title: 'Critical Action',
  message: 'This requires explicit confirmation.',
  canDismiss: false,  // Can't click outside or ESC
  confirmLabel: 'I Understand'
});
```

### Pattern 4: With Action
```typescript
await confirmSuccess({
  title: 'Approve',
  message: 'Approve this decision?',
  onConfirm: async () => {
    await approve();
    toast.success('Approved');
  }
});

// Dialog closes automatically after onConfirm completes
```

---

## 🎯 Variant Guide

### Danger (Red) - Destructive Actions
```typescript
await confirmDanger({
  title: 'Delete Data',
  message: 'Are you sure?'
});
```
**Use for**: Delete, Remove, Reject, Cancel (irreversible)

### Warning (Amber) - Caution Required
```typescript
await confirmWarning({
  title: 'Overwrite File',
  message: 'File exists. Replace?'
});
```
**Use for**: Overwrite, Replace, Modify (potential data loss)

### Success (Green) - Positive Actions
```typescript
await confirmSuccess({
  title: 'Approve FDP',
  message: 'Confirm approval?'
});
```
**Use for**: Approve, Accept, Finalize, Submit

### Info (Blue) - General Confirmations
```typescript
await confirm({
  title: 'Export Data',
  message: 'Export to Excel?',
  type: 'info'
});
```
**Use for**: Export, Save, Continue, General questions

---

## ✅ Checklist

When implementing a confirmation:

- [ ] Import `useConfirmation` hook
- [ ] Choose appropriate method (danger/warning/success/confirm)
- [ ] Set descriptive title
- [ ] Write clear message
- [ ] Add details if needed
- [ ] Handle both confirmed and cancelled cases
- [ ] Add toast notification after action
- [ ] Test confirm and cancel flows

---

## 🐛 Troubleshooting

### Dialog doesn't show
```typescript
// ❌ Problem: Not using the hook
const handleDelete = async () => {
  confirmDanger({ ... }); // Won't work
};

// ✅ Solution: Use the hook
const { confirmDanger } = useConfirmation();
const handleDelete = async () => {
  await confirmDanger({ ... });
};
```

### Can't click outside to close
```typescript
// If canDismiss is false:
await confirm({
  title: '...',
  message: '...',
  canDismiss: false  // User MUST click a button
});
```

### Action doesn't wait for confirmation
```typescript
// ❌ Problem: Not awaiting
confirmDanger({ ... });
deleteItem(); // Runs immediately!

// ✅ Solution: Await the confirmation
const confirmed = await confirmDanger({ ... });
if (confirmed) {
  deleteItem();
}
```

### Loading state not showing
```typescript
// ✅ Make sure showLoadingState is true (it is by default)
await confirm({
  showLoadingState: true,  // Default is true
  onConfirm: async () => {
    await longOperation();  // Spinner shows here
  }
});
```

---

## 📊 Examples by Use Case

### Delete Item
```typescript
const { confirmDanger } = useConfirmation();
await confirmDanger({
  title: 'Delete Item',
  message: `Delete "${item.name}"?`,
  details: 'This action cannot be undone.',
  confirmLabel: 'Delete'
});
```

### Approve Decision
```typescript
const { confirmSuccess } = useConfirmation();
await confirmSuccess({
  title: 'Approve Decision',
  message: `Approve "${decision.title}"?`,
  details: 'All stakeholders will be notified.',
  confirmLabel: 'Approve'
});
```

### Export Data
```typescript
const { confirm } = useConfirmation();
await confirm({
  title: 'Export Data',
  message: 'Export to Excel format?',
  details: `${recordCount} records will be exported.`,
  type: 'info'
});
```

### Overwrite File
```typescript
const { confirmWarning } = useConfirmation();
await confirmWarning({
  title: 'File Exists',
  message: `"${filename}" already exists.`,
  details: 'Overwriting will replace the existing file.',
  confirmLabel: 'Replace'
});
```

### Reject Action
```typescript
const { confirmDanger } = useConfirmation();
await confirmDanger({
  title: 'Reject Decision',
  message: 'Send this back for revision?',
  confirmLabel: 'Reject'
});
```

---

## 🔗 Related

- **Full Guide**: `/CONFIRMATION_DIALOGS_GUIDE.md`
- **Context**: `/src/app/context/ConfirmationContext.tsx`
- **Component**: `/src/app/components/ui/confirmation-dialog.tsx`

---

**Quick Reference Version**: 1.0.0  
**Print for easy access** 📄
