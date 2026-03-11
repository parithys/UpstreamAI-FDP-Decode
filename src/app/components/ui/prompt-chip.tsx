import * as React from "react";
import { cn } from "./utils";

export interface PromptChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PromptChip({
  children,
  className = "",
  ...props
}: PromptChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-4 py-2 rounded-full text-sm text-text-secondary",
        "bg-background-secondary border border-card-border",
        "hover:border-accent hover:text-text-primary hover:bg-card/80",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}