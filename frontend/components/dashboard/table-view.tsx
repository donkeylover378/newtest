"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import type { Audit, AuditStatus } from "@/lib/types";
import { formatRelativeTime, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const statusConfig: Record<AuditStatus, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In progress", color: "bg-terracotta/10 text-terracotta" },
  awaiting_accountant: { label: "Awaiting accountant", color: "bg-amber/10 text-amber" },
  review: { label: "Review", color: "bg-gold/10 text-gold" },
  signed: { label: "Signed", color: "bg-forest/10 text-forest" },
};

type SortKey = keyof Audit;
type SortDir = "asc" | "desc";

interface TableViewProps {
  audits: Audit[];
  onRowClick?: (audit: Audit) => void;
}

export function TableView({ audits, onRowClick }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const sorted = useMemo(() => {
    const arr = [...audits];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null || bv == null) return 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [audits, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const rows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const columns: { key: SortKey; label: string; render: (a: Audit) => React.ReactNode }[] = [
    {
      key: "fundName", label: "Fund name",
      render: (a) => <span className="font-semibold">{a.fundName}</span>,
    },
    {
      key: "year", label: "Year",
      render: (a) => <span className="font-mono text-xs">{a.year}</span>,
    },
    {
      key: "status", label: "Status",
      render: (a) => {
        const cfg = statusConfig[a.status];
        return <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", cfg.color)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", cfg.color.replace("/10", ""))} />
          {cfg.label}
        </span>;
      },
    },
    {
      key: "progress", label: "Progress",
      render: (a) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-[var(--muted)]">
            <div
              className={cn("h-1.5 rounded-full transition-all", a.progress === 100 ? "bg-forest" : a.progress >= 60 ? "bg-gold" : "bg-terracotta")}
              style={{ width: `${a.progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--muted-foreground)]">{formatPercentage(a.progress)}</span>
        </div>
      ),
    },
    {
      key: "queriesOpen", label: "Queries",
      render: (a) => (
        <span className={cn("font-mono text-sm", a.queriesOpen > 0 ? "text-amber font-medium" : "text-[var(--muted-foreground)]")}>
          {a.queriesOpen}
        </span>
      ),
    },
    {
      key: "autoEnabled", label: "Auto",
      render: (a) => a.autoEnabled ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
          <Sparkles className="h-3 w-3" /> On
        </span>
      ) : <span className="text-xs text-[var(--muted-foreground)]">Off</span>,
    },
    {
      key: "lastActivity", label: "Last activity",
      render: (a) => <span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(a.lastActivity)}</span>,
    },
    {
      key: "owner", label: "Owner",
      render: (a) => {
        const initials = a.owner.split(" ").map((w) => w[0]).join("");
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-[10px] font-semibold">
              {initials}
            </div>
            <span className="text-sm">{a.owner}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-cream">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-cream border-b border-[var(--border)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] cursor-pointer select-none"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((audit) => (
              <tr
                key={audit.id}
                className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[#F5F0E0] cursor-pointer"
                onClick={() => onRowClick?.(audit)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(audit)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  No audits match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {audits.length > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, audits.length)} of {audits.length} audits
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-8 h-8 text-sm rounded-lg",
                  page === i ? "bg-terracotta text-white" : "border border-[var(--border)] hover:bg-cream"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
              disabled={page >= pageCount - 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
