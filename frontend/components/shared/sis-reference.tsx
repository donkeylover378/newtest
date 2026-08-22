"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { findGlossaryEntry } from "@/lib/glossary";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExternalLink } from "lucide-react";

interface SisReferenceProps {
  reference: string;
  className?: string;
}

export function SisReference({ reference, className }: SisReferenceProps) {
  const entry = findGlossaryEntry(reference);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setOpen(true), 200);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!entry) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-cream px-2 py-0.5 text-xs font-medium text-ink border border-[var(--border)]",
          className
        )}
      >
        {reference}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className={cn(
            "inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold-dark border border-gold/20",
            "hover:bg-gold/20 transition-colors cursor-help",
            className
          )}
        >
          {entry.reference}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onMouseEnter={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
        }}
        onMouseLeave={handleMouseLeave}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-3">
          <div>
            <h4 className="font-serif font-semibold text-sm text-ink">
              {entry.term}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entry.reference}
            </p>
          </div>

          <p className="text-sm text-ink leading-relaxed">
            {entry.definition}
          </p>

          {entry.relatedItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Related
              </p>
              <div className="flex flex-wrap gap-1">
                {entry.relatedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex rounded-full bg-cream px-2 py-0.5 text-[10px] text-muted-foreground border border-[var(--border)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={entry.atoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:text-terracotta-dark transition-colors"
          >
            View on ATO
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
