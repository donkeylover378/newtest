"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";

interface SuggestedNextActionProps {
  suggestion: string;
  actionLabel: string;
  onAction: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function SuggestedNextAction({
  suggestion,
  actionLabel,
  onAction,
  onDismiss,
  className,
}: SuggestedNextActionProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Slide-up animation on mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    setVisible(false);
    // Wait for slide-out animation before removing
    setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 200);
  };

  return (
    <div
      className={cn(
        "sticky bottom-4 z-30 mx-auto max-w-3xl px-4 transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
        className
      )}
    >
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-cream p-3 pl-0 shadow-lg overflow-hidden">
        {/* Gold left border */}
        <div className="w-1 self-stretch rounded-l-xl bg-gold shrink-0" />

        <div className="flex items-center gap-2 text-gold shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>

        <p className="flex-1 text-sm text-ink min-w-0">{suggestion}</p>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="gold" onClick={onAction}>
            {actionLabel}
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md p-1 text-muted-foreground hover:text-ink transition-colors"
            aria-label="Dismiss suggestion"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
