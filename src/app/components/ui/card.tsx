import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const cardVariants = cva(
  "rounded-xl overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border border-card-border shadow-glow hover:border-card-hover hover:shadow-glow-hover",
        flat: "bg-card/50 border border-transparent",
        elevated: "bg-card border border-accent/30 shadow-glow-hover",
        glass: "bg-card backdrop-blur-xl border border-card-border shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  title?: string;
  action?: React.ReactNode;
  disabled?: boolean;
}

function Card({ className, variant, title, action, children, disabled, onClick, onKeyDown, ...props }: CardProps) {
  const isClickable = Boolean(onClick);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.(e as any);
    }
    onKeyDown?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant }),
        isClickable && !disabled ? "cursor-pointer active:scale-[0.99]" : "",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className
      )}
      aria-disabled={disabled}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable || onKeyDown ? handleKeyDown : undefined}
      {...props}
    >
      {(title || action) && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          {title && (
            <h3 className="text-h4 text-text-primary">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {!title && !action ? (
        children
      ) : (
        <div className="p-6">{children}</div>
      )}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-lg font-semibold text-text-primary leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
export type { CardProps };