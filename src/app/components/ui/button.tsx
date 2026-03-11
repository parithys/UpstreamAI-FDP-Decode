import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 rounded-lg",
        primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 rounded-lg",
        secondary: "bg-background-secondary border border-card-border text-text-primary hover:border-accent hover:text-accent rounded-lg",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg",
        pill: "bg-background-secondary border border-card-border text-text-secondary hover:border-accent hover:text-accent rounded-full",
        destructive: "bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20 rounded-lg",
        danger: "bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20 rounded-lg",
        warning: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 rounded-lg",
        outline: "border bg-transparent border-card-border text-text-primary hover:bg-white/5 hover:border-accent rounded-lg",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };