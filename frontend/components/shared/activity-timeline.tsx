"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import type { ActivityEvent } from "@/lib/types";

const eventTypeColors: Record<string, { dot: string; bg: string }> = {
  status_change: { dot: "bg-terracotta", bg: "bg-terracotta/10" },
  query_sent: { dot: "bg-amber", bg: "bg-amber/10" },
  query_replied: { dot: "bg-amber", bg: "bg-amber/10" },
  document_uploaded: { dot: "bg-blue-500", bg: "bg-blue-500/10" },
  auto_completed: { dot: "bg-gold", bg: "bg-gold/10" },
  finding_raised: { dot: "bg-rose", bg: "bg-rose/10" },
  audit_signed: { dot: "bg-forest", bg: "bg-forest/10" },
  note_added: { dot: "bg-terracotta", bg: "bg-terracotta/10" },
  item_reviewed: { dot: "bg-forest", bg: "bg-forest/10" },
};

interface ActivityTimelineProps {
  events: ActivityEvent[];
  compact?: boolean;
  className?: string;
  initialCount?: number;
}

export function ActivityTimeline({
  events,
  compact = false,
  className,
  initialCount = 5,
}: ActivityTimelineProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayed = showAll ? events : events.slice(0, initialCount);
  const hasMore = events.length > initialCount;

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div
        className={cn(
          "absolute left-3.5 top-2 bottom-2 w-px bg-[var(--border)]",
          compact && "left-2.5"
        )}
        aria-hidden="true"
      />

      <div className={cn("space-y-4", compact && "space-y-2.5")}>
        {displayed.map((event) => {
          const colours = eventTypeColors[event.type] ?? eventTypeColors.status_change;
          return (
            <div
              key={event.id}
              className={cn(
                "relative flex gap-3",
                compact && "gap-2"
              )}
            >
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center rounded-full",
                  compact ? "h-5 w-5" : "h-7 w-7",
                  colours.bg
                )}
              >
                {compact ? (
                  <span
                    className={cn("block h-2 w-2 rounded-full", colours.dot)}
                  />
                ) : (
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-ink",
                      colours.bg
                    )}
                  >
                    {event.actorInitials}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    "text-ink leading-snug",
                    compact ? "text-xs" : "text-sm"
                  )}
                >
                  <span className="font-semibold">{event.actor}</span>{" "}
                  <span className="text-muted-foreground">
                    {event.description}
                  </span>
                </p>
                <p
                  className={cn(
                    "text-muted-foreground mt-0.5",
                    compact ? "text-[10px]" : "text-xs"
                  )}
                >
                  {formatRelativeTime(event.timestamp)}
                  {event.fundName && !compact && (
                    <span> &middot; {event.fundName}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={cn(
            "mt-3 ml-10 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors",
            compact && "ml-7 text-xs"
          )}
        >
          Show {events.length - initialCount} more
        </button>
      )}

      {hasMore && showAll && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className={cn(
            "mt-3 ml-10 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors",
            compact && "ml-7 text-xs"
          )}
        >
          Show less
        </button>
      )}
    </div>
  );
}
