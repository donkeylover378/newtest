"use client";

import * as React from "react";
import type { ActivityEvent } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const eventDotColour: Record<ActivityEvent["type"], string> = {
  status_change: "bg-terracotta",
  query_sent: "bg-amber",
  query_replied: "bg-forest",
  document_uploaded: "bg-gold",
  auto_completed: "bg-gold",
  finding_raised: "bg-rose",
  audit_signed: "bg-forest",
  note_added: "bg-ink/40",
  item_reviewed: "bg-terracotta/60",
};

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxVisible?: number;
}

export function ActivityFeed({ events, maxVisible = 6 }: ActivityFeedProps) {
  const [visibleCount, setVisibleCount] = React.useState(maxVisible);

  const displayed = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  return (
    <div className="space-y-0">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--border)]" />

        {displayed.map((event, idx) => (
          <div
            key={event.id}
            className={cn(
              "relative flex gap-3 py-3",
              idx === 0 && "animate-fade-in"
            )}
          >
            {/* Dot + initials */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                  eventDotColour[event.type] ?? "bg-ink/30"
                )}
              >
                {event.actorInitials}
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm text-ink leading-snug">
                <span className="font-medium">{event.actor}</span>{" "}
                <span className="text-muted-foreground">
                  {event.description
                    .replace(event.actor, "")
                    .replace(/^\s+/, "")}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatRelativeTime(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="pt-2 pl-11">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisibleCount((c) => c + 5)}
            className="text-xs text-muted-foreground"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
