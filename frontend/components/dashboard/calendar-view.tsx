"use client";

import * as React from "react";
import type { Audit, AuditStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColourMap: Record<AuditStatus, string> = {
  not_started: "bg-ink/30",
  in_progress: "bg-terracotta",
  awaiting_accountant: "bg-amber",
  review: "bg-gold",
  signed: "bg-forest",
};

const statusLabelMap: Record<AuditStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  awaiting_accountant: "Awaiting accountant",
  review: "Review",
  signed: "Signed",
};

const monthNames = [
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
];

interface CalendarViewProps {
  audits: Audit[];
  onAuditClick?: (audit: Audit) => void;
}

export function CalendarView({ audits, onAuditClick }: CalendarViewProps) {
  const [fyStartYear, setFyStartYear] = React.useState(() => {
    const now = new Date();
    return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  });

  const fyLabel = `FY${fyStartYear + 1}`;

  // Build month cells: July of fyStartYear through June of fyStartYear+1
  const monthCells = React.useMemo(() => {
    return monthNames.map((name, idx) => {
      const year = idx < 6 ? fyStartYear : fyStartYear + 1;
      const monthIdx = idx < 6 ? idx + 6 : idx - 6; // 0-indexed month (Jul=6, Aug=7, ...)
      return { name, year, monthIdx };
    });
  }, [fyStartYear]);

  // Map audits to the month of their yearEndDate
  const auditsByMonth = React.useMemo(() => {
    const map: Record<string, Audit[]> = {};
    for (const audit of audits) {
      const d = new Date(audit.yearEndDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = [];
      map[key].push(audit);
    }
    return map;
  }, [audits]);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  return (
    <div className="space-y-4">
      {/* Year navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFyStartYear((y) => y - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          FY{fyStartYear}
        </Button>
        <h3 className="font-serif text-lg font-semibold text-ink">{fyLabel}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFyStartYear((y) => y + 1)}
        >
          FY{fyStartYear + 2}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 12-month grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {monthCells.map((cell) => {
          const key = `${cell.year}-${cell.monthIdx}`;
          const cellAudits = auditsByMonth[key] ?? [];
          const isCurrent = key === currentMonthKey;

          return (
            <div
              key={key}
              className={cn(
                "rounded-xl border border-[var(--border)] bg-cream p-3 min-h-[120px] transition-colors",
                isCurrent && "ring-2 ring-terracotta/40 border-terracotta/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-terracotta" : "text-muted-foreground"
                  )}
                >
                  {cell.name}
                </span>
                {cellAudits.length > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {cellAudits.length}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {cellAudits.map((audit) => (
                  <button
                    key={audit.id}
                    onClick={() => onAuditClick?.(audit)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white transition-transform hover:scale-105 cursor-pointer",
                      statusColourMap[audit.status]
                    )}
                    title={`${audit.fundName} — ${statusLabelMap[audit.status]}`}
                  >
                    <span className="max-w-[60px] truncate">
                      {audit.fundName.split(" ")[0]}
                    </span>
                  </button>
                ))}
                {cellAudits.length === 0 && (
                  <span className="text-[10px] text-muted-foreground/50">
                    No audits
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {(Object.entries(statusLabelMap) as [AuditStatus, string][]).map(
          ([status, label]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className={cn("h-2.5 w-2.5 rounded-full", statusColourMap[status])}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
