"use client";

import * as React from "react";
import type { Audit, AuditStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/lib/format";
import { Sparkles, MessageSquare } from "lucide-react";

const kanbanColumns: {
  status: AuditStatus;
  label: string;
  colour: string;
  bgColour: string;
}[] = [
  {
    status: "not_started",
    label: "Not started",
    colour: "bg-ink/40",
    bgColour: "bg-ink/5",
  },
  {
    status: "in_progress",
    label: "In progress",
    colour: "bg-terracotta",
    bgColour: "bg-terracotta/5",
  },
  {
    status: "awaiting_accountant",
    label: "Awaiting accountant",
    colour: "bg-amber",
    bgColour: "bg-amber/5",
  },
  {
    status: "review",
    label: "Review",
    colour: "bg-gold",
    bgColour: "bg-gold/5",
  },
  {
    status: "signed",
    label: "Signed",
    colour: "bg-forest",
    bgColour: "bg-forest/5",
  },
];

interface KanbanViewProps {
  audits: Audit[];
  onCardClick?: (audit: Audit) => void;
  onStatusChange?: (auditId: string, newStatus: AuditStatus) => void;
}

export function KanbanView({
  audits,
  onCardClick,
  onStatusChange,
}: KanbanViewProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<AuditStatus | null>(null);

  const columnAudits = React.useMemo(() => {
    const grouped: Record<AuditStatus, Audit[]> = {
      not_started: [],
      in_progress: [],
      awaiting_accountant: [],
      review: [],
      signed: [],
    };
    for (const audit of audits) {
      grouped[audit.status]?.push(audit);
    }
    return grouped;
  }, [audits]);

  function handleDragStart(e: React.DragEvent, auditId: string) {
    setDraggedId(auditId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", auditId);
  }

  function handleDragOver(e: React.DragEvent, status: AuditStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  function handleDrop(e: React.DragEvent, status: AuditStatus) {
    e.preventDefault();
    const auditId = e.dataTransfer.getData("text/plain");
    if (auditId && onStatusChange) {
      onStatusChange(auditId, status);
    }
    setDraggedId(null);
    setDragOverColumn(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverColumn(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {kanbanColumns.map((col) => {
        const items = columnAudits[col.status];
        const isOver = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            className={cn(
              "flex min-w-[260px] flex-1 flex-col rounded-xl border border-[var(--border)] bg-cream transition-colors",
              isOver && "ring-2 ring-terracotta/30"
            )}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Colour bar */}
            <div className={cn("h-1 rounded-t-xl", col.colour)} />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-ink">{col.label}</h3>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--muted)] px-1.5 text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className={cn("flex-1 space-y-2 p-3", col.bgColour)}>
              {items.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No audits
                </p>
              )}
              {items.map((audit) => (
                <div
                  key={audit.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, audit.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick?.(audit)}
                  className={cn(
                    "cursor-grab rounded-lg border border-[var(--border)] bg-white p-3 shadow-sm",
                    "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    "active:cursor-grabbing",
                    draggedId === audit.id && "opacity-50"
                  )}
                >
                  {/* Fund name + year */}
                  <p className="text-sm font-semibold text-ink leading-tight">
                    {audit.fundName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    FY{audit.year}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-[var(--muted)]">
                      <div
                        className={cn(
                          "h-1 rounded-full",
                          audit.progress === 100
                            ? "bg-forest"
                            : audit.progress >= 60
                              ? "bg-gold"
                              : "bg-terracotta"
                        )}
                        style={{ width: `${audit.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {formatPercentage(audit.progress)}
                    </span>
                  </div>

                  {/* Footer row */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {audit.daysInStatus}d in col
                      </span>
                      {audit.autoEnabled && (
                        <Badge variant="auto" className="h-4 text-[10px] px-1.5 py-0">
                          <Sparkles className="h-2.5 w-2.5" />
                          Auto
                        </Badge>
                      )}
                      {audit.queriesOpen > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber">
                          <MessageSquare className="h-2.5 w-2.5" />
                          {audit.queriesOpen}
                        </span>
                      )}
                    </div>
                    {/* Owner initials */}
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta/10 text-[9px] font-semibold text-terracotta">
                      {audit.owner
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
