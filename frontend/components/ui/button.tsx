"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-terracotta text-white hover:bg-terracotta-dark shadow-sm",
        secondary: "bg-cream text-ink border border-[var(--border)] hover:bg-[var(--muted)]",
        ghost: "hover:bg-cream text-ink",
        destructive: "bg-rose text-white hover:bg-rose-dark",
        outline: "border border-[var(--border)] bg-transparent hover:bg-cream text-ink",
        link: "text-terracotta underline-offset-4 hover:underline p-0 h-auto",
        gold: "bg-gold text-white hover:bg-gold-dark shadow-sm",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  shortcut?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, shortcut, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
        {shortcut && (
          <kbd className="ml-1 pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium">
            {shortcut}
          </kbd>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
