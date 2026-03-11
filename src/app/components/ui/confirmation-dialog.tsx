import { AlertTriangle, Info, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';
import { useState, useEffect } from 'react';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success';

export interface SimpleConfirmationDialogProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;
  
  /**
   * Callback when dialog should close
   */
  onClose: () => void;
  
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Main message content
   */
  message: string;
  
  /**
   * Additional details (optional)
   */
  details?: string;
  
  /**
   * Confirm button label
   * @default 'Confirm'
   */
  confirmLabel?: string;
  
  /**
   * Cancel button label
   * @default 'Cancel'
   */
  cancelLabel?: string;
  
  /**
   * Callback when user confirms
   */
  onConfirm: () => void | Promise<void>;
  
  /**
   * Callback when user cancels (optional)
   */
  onCancel?: () => void;
  
  /**
   * Dialog type/variant
   * @default 'info'
   */
  variant?: ConfirmationType;
  
  /**
   * Whether to show icon
   * @default true
   */
  showIcon?: boolean;
  
  /**
   * Whether to show loading state on confirm
   * @default true
   */
  showLoadingState?: boolean;
  
  /**
   * Whether dialog can be dismissed by clicking outside or ESC
   * @default true
   */
  canDismiss?: boolean;
  
  /**
   * Custom className for dialog container
   */
  className?: string;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-danger',
    iconBg: 'bg-danger/10',
    confirmVariant: 'danger' as const,
    borderColor: 'border-danger/30',
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    confirmVariant: 'primary' as const,
    borderColor: 'border-warning/30',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    confirmVariant: 'primary' as const,
    borderColor: 'border-primary/30',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
    confirmVariant: 'primary' as const,
    borderColor: 'border-success/30',
  },
};

/**
 * SimpleConfirmationDialog Component
 * A standalone confirmation dialog that doesn't require context
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <SimpleConfirmationDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item?"
 *   variant="danger"
 *   onConfirm={async () => {
 *     await deleteItem();
 *     setIsOpen(false);
 *   }}
 * />
 */
export function SimpleConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
  showIcon = true,
  showLoadingState = true,
  canDismiss = true,
  className,
}: SimpleConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !canDismiss) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, canDismiss]);

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    if (showLoadingState) setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      // Keep dialog open if action fails
    } finally {
      if (showLoadingState) setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onCancel?.();
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (canDismiss && !isLoading && e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div 
        className={cn(
          "bg-popover rounded-lg border border-card-border shadow-glow max-w-md w-full m-4 animate-in zoom-in-95 duration-200",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {showIcon && (
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', config.iconBg)}>
                <Icon className={cn('w-6 h-6', config.iconColor)} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-text-primary mb-2"
              >
                {title}
              </h2>
              <p 
                id="dialog-description"
                className="text-sm text-text-secondary leading-relaxed break-words"
              >
                {message}
              </p>
              {details && (
                <p className="text-xs text-text-tertiary leading-relaxed mt-2 break-words">
                  {details}
                </p>
              )}
            </div>
            {canDismiss && !isLoading && (
              <button
                onClick={handleCancel}
                className="text-text-tertiary hover:text-text-primary transition-colors -mt-1 -mr-1 flex-shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : config.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * DangerConfirmationDialog Component
 * Pre-configured danger variant
 */
export function DangerConfirmationDialog(
  props: Omit<SimpleConfirmationDialogProps, 'variant'>
) {
  return <SimpleConfirmationDialog {...props} variant="danger" />;
}

/**
 * WarningConfirmationDialog Component
 * Pre-configured warning variant
 */
export function WarningConfirmationDialog(
  props: Omit<SimpleConfirmationDialogProps, 'variant'>
) {
  return <SimpleConfirmationDialog {...props} variant="warning" />;
}

/**
 * SuccessConfirmationDialog Component
 * Pre-configured success variant
 */
export function SuccessConfirmationDialog(
  props: Omit<SimpleConfirmationDialogProps, 'variant'>
) {
  return <SimpleConfirmationDialog {...props} variant="success" />;
}

/**
 * InfoConfirmationDialog Component
 * Pre-configured info variant
 */
export function InfoConfirmationDialog(
  props: Omit<SimpleConfirmationDialogProps, 'variant'>
) {
  return <SimpleConfirmationDialog {...props} variant="info" />;
}