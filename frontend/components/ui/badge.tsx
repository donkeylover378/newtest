"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-cream text-ink border-[var(--border)]",
        pass: "bg-forest/10 text-forest border-forest/20",
        fail: "bg-rose/10 text-rose border-rose/20",
        query: "bg-amber/10 text-amber border-amber/20",
        na: "bg-gray-100 text-gray-500 border-gray-200",
        todo: "bg-cream text-ink border-[var(--border)]",
        auto: "bg-gold/10 text-gold border-gold/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const dotColorMap: Record<string, string> = {
  default: "bg-ink",
  pass: "bg-forest",
  fail: "bg-rose",
  query: "bg-amber",
  na: "bg-gray-400",
  todo: "bg-ink/40",
  auto: "bg-gold",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  sparkle?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, sparkle, children, ...props }, ref) => {
    const v = variant ?? "default";
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              dotColorMap[v] ?? dotColorMap.default
            )}
          />
        )}
        {v === "auto" && sparkle !== false && (
          <Sparkles className="h-3 w-3 shrink-0" />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
