import * as React from "react";
import { X } from "lucide-react";

export interface NewsTickerProps {
  message: string;
  linkText?: string;
  linkHref?: string;
  onDismiss?: () => void;
}

export function NewsTicker({
  message,
  linkText,
  linkHref,
  onDismiss,
}: NewsTickerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-accent/10 border-b border-accent/20 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center text-sm text-text-secondary overflow-hidden">
        <span className="w-2 h-2 rounded-full bg-success mr-3 flex-shrink-0 animate-pulse" />
        <p className="truncate">
          <span className="text-text-primary mr-2">{message}</span>
          {linkText && linkHref && (
            <a
              href={linkHref}
              className="text-accent hover:text-accent-glow hover:underline ml-1 font-medium"
            >
              {linkText}
            </a>
          )}
        </p>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          onDismiss?.();
        }}
        className="ml-4 text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
