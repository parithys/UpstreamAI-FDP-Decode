import { AlertTriangle, Info, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { useState } from 'react';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmationType;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isDangerous?: boolean;
  showIcon?: boolean;
  /**
   * Additional details to show below the main message
   */
  details?: string;
  /**
   * Whether to show loading state on confirm button
   * @default true
   */
  showLoadingState?: boolean;
  /**
   * Whether the dialog can be closed by clicking outside or pressing ESC
   * @default true
   */
  canDismiss?: boolean;
}

interface ConfirmationDialogProps extends ConfirmationConfig {
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig = {
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
    confirmVariant: 'warning' as const,
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

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'info',
  onConfirm,
  onCancel,
  isDangerous = false,
  showIcon = true,
  details,
  showLoadingState = true,
  canDismiss = true,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  const [isLoading, setIsLoading] = useState(false);

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
    onCancel?.();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (canDismiss && e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div className="bg-popover rounded-lg border border-card-border shadow-glow max-w-md w-full m-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {showIcon && (
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', config.iconBg)}>
                <Icon className={cn('w-6 h-6', config.iconColor)} />
              </div>
            )}
            <div className="flex-1">
              <h2
                id="confirmation-title"
                className="text-lg font-semibold text-text-primary mb-2"
              >
                {title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {message}
              </p>
              {details && (
                <p className="text-sm text-text-secondary leading-relaxed mt-2">
                  {details}
                </p>
              )}
            </div>
            <button
              onClick={handleCancel}
              className="text-text-tertiary hover:text-text-primary transition-colors -mt-1 -mr-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : config.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}