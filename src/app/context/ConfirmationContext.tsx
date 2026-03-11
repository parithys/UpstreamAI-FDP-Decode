import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfirmationDialog, ConfirmationConfig } from '../components/ConfirmationDialog';

interface ConfirmationContextType {
  /**
   * Show a general confirmation dialog
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm: (config: Omit<ConfirmationConfig, 'onConfirm'> & { onConfirm?: () => void | Promise<void> }) => Promise<boolean>;
  
  /**
   * Show a danger confirmation dialog (red/destructive)
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirmDanger: (config: Omit<ConfirmationConfig, 'onConfirm' | 'type' | 'isDangerous'> & { onConfirm?: () => void | Promise<void> }) => Promise<boolean>;
  
  /**
   * Show a warning confirmation dialog (amber)
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirmWarning: (config: Omit<ConfirmationConfig, 'onConfirm' | 'type'> & { onConfirm?: () => void | Promise<void> }) => Promise<boolean>;
  
  /**
   * Show a success confirmation dialog (green)
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirmSuccess: (config: Omit<ConfirmationConfig, 'onConfirm' | 'type'> & { onConfirm?: () => void | Promise<void> }) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    config: ConfirmationConfig | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    config: null,
    resolve: null,
  });

  const confirm = useCallback(
    (config: Omit<ConfirmationConfig, 'onConfirm'> & { onConfirm?: () => void | Promise<void> }): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmationState({
          isOpen: true,
          config: {
            ...config,
            onConfirm: async () => {
              if (config.onConfirm) {
                await config.onConfirm();
              }
            },
          } as ConfirmationConfig,
          resolve,
        });
      });
    },
    []
  );

  const confirmDanger = useCallback(
    (config: Omit<ConfirmationConfig, 'onConfirm' | 'type' | 'isDangerous'> & { onConfirm?: () => void | Promise<void> }): Promise<boolean> => {
      return confirm({
        ...config,
        type: 'danger',
        isDangerous: true,
      });
    },
    [confirm]
  );

  const confirmWarning = useCallback(
    (config: Omit<ConfirmationConfig, 'onConfirm' | 'type'> & { onConfirm?: () => void | Promise<void> }): Promise<boolean> => {
      return confirm({
        ...config,
        type: 'warning',
        });
    },
    [confirm]
  );

  const confirmSuccess = useCallback(
    (config: Omit<ConfirmationConfig, 'onConfirm' | 'type'> & { onConfirm?: () => void | Promise<void> }): Promise<boolean> => {
      return confirm({
        ...config,
        type: 'success',
      });
    },
    [confirm]
  );

  const handleClose = useCallback(() => {
    setConfirmationState((prev) => {
      prev.resolve?.(false);
      return {
        isOpen: false,
        config: null,
        resolve: null,
      };
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmationState.config?.onConfirm) {
      await confirmationState.config.onConfirm();
    }
    setConfirmationState((prev) => {
      prev.resolve?.(true);
      return {
        isOpen: false,
        config: null,
        resolve: null,
      };
    });
  }, [confirmationState.config]);

  return (
    <ConfirmationContext.Provider value={{ confirm, confirmDanger, confirmWarning, confirmSuccess }}>
      {children}
      {confirmationState.config && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={handleClose}
          {...confirmationState.config}
          onConfirm={handleConfirm}
          onCancel={handleClose}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    // Return a safe fallback to prevent crashes when used outside provider (e.g. in tests or previews)
    console.warn('useConfirmation used outside of ConfirmationProvider. Using fallback implementation.');
    return {
      confirm: async () => true,
      confirmDanger: async () => true,
      confirmWarning: async () => true,
      confirmSuccess: async () => true,
    };
  }
  return context;
}
