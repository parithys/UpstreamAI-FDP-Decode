import * as React from "react";
import { Send } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const inputVariants = cva(
  "w-full bg-input-bg border text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
  {
    variants: {
      variant: {
        default: "h-10 px-3 rounded-lg border-input-border",
        chat: "h-12 pl-4 pr-12 rounded-xl border-input-border shadow-lg",
      },
      size: {
        default: "h-10 px-3 rounded-lg border-input-border",
        small: "h-8 px-2 rounded-md border-input-border",
        large: "h-12 px-4 rounded-xl border-input-border",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onSend?: () => void;
}

function Input({
  className,
  type,
  label,
  error,
  icon,
  variant = "default",
  onSend,
  disabled,
  ...props
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && variant === "chat" && onSend && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-label text-text-secondary mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && variant === "default" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          data-slot="input"
          className={cn(
            inputVariants({ variant }),
            error && "border-danger focus:ring-danger focus:border-danger",
            icon && variant === "default" && "pl-10",
            className
          )}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {variant === "chat" && (
          <button
            onClick={onSend}
            disabled={disabled}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-caption text-danger">{error}</p>}
    </div>
  );
}

export { Input, inputVariants };
export type { InputProps };