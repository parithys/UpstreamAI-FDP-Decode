import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none shrink-0 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20",
        success: "bg-success/10 text-success border-success/20",
        danger: "bg-danger/10 text-danger border-danger/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        info: "bg-accent/10 text-accent border-accent/20",
        neutral: "bg-white/5 text-text-secondary border-white/10",
        secondary: "bg-background-secondary text-text-secondary border-card-border",
        destructive: "bg-danger/10 text-danger border-danger/20",
        outline: "text-text-primary border-card-border bg-transparent",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
        lg: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  const isClickable = Boolean(props.onClick);

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size }), 
        isClickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };