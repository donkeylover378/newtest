"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Search,
  Check,
  X,
  MessageSquare,
  Minus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import type { ChecklistItem, ChecklistStatus } from "@/lib/types";

type FilterType = "all" | "pending" | "queries" | "auto" | "failed";

interface ChecklistPanelProps {
  items: ChecklistItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onQuickAction?: (id: string, status: ChecklistStatus) => void;
}

const statusDotColour: Record<ChecklistStatus, string> = {
  pass: "bg-forest",
  fail: "bg-rose",
  query: "bg-amber",
  na: "bg-gray-400",
  todo: "bg-[var(--border)]",
  auto: "bg-gold",
};

function matchesFilter(item: ChecklistItem, filter: FilterType): boolean {
  switch (filter) {
    case "all":
      return true;
    case "pending":
      return item.status === "todo";
    case "queries":
      return item.status === "query";
    case "auto":
      return item.autoCompleted;
    case "failed":
      return item.status === "fail";
  }
}

export function ChecklistPanel({
  items,
  selectedItemId,
  onSelectItem,
  onQuickAction,
}: ChecklistPanelProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (!matchesFilter(item, filter)) return false;
      if (
        search &&
        !item.questionText.toLowerCase().includes(search.toLowerCase()) &&
        !item.sisReference.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, filter, search]);

  // Build rows: interleave phase headers with items
  const rows = useMemo(() => {
    const result: Array<
      { type: "header"; label: string } | { type: "item"; item: ChecklistItem }
    > = [];
    let lastPhase = "";
    for (const item of filtered) {
      if (item.phaseLabel !== lastPhase) {
        result.push({ type: "header", label: item.phaseLabel });
        lastPhase = item.phaseLabel;
      }
      result.push({ type: "item", item });
    }
    return result;
  }, [filtered]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index].type === "header" ? 40 : 76),
    overscan: 5,
  });

  // Filter counts
  const counts = useMemo(() => {
    const c: Record<FilterType, number> = {
      all: items.length,
      pending: 0,
      queries: 0,
      auto: 0,
      failed: 0,
    };
    for (const item of items) {
      if (item.status === "todo") c.pending++;
      if (item.status === "query") c.queries++;
      if (item.autoCompleted) c.auto++;
      if (item.status === "fail") c.failed++;
    }
    return c;
  }, [items]);

  // Keyboard navigation
  const selectedIndex = useMemo(() => {
    if (!selectedItemId) return -1;
    return filtered.findIndex((i) => i.id === selectedItemId);
  }, [filtered, selectedItemId]);

  const navigate = useCallback(
    (direction: "up" | "down") => {
      if (filtered.length === 0) return;
      let next: number;
      if (selectedIndex === -1) {
        next = 0;
      } else if (direction === "down") {
        next = Math.min(selectedIndex + 1, filtered.length - 1);
      } else {
        next = Math.max(selectedIndex - 1, 0);
      }
      onSelectItem(filtered[next].id);
      // Scroll to item in virtualizer
      const rowIndex = rows.findIndex(
        (r) => r.type === "item" && r.item.id === filtered[next].id
      );
      if (rowIndex >= 0) virtualizer.scrollToIndex(rowIndex);
    },
    [filtered, selectedIndex, onSelectItem, rows, virtualizer]
  );

  useHotkeys("j", () => navigate("down"), { preventDefault: true }, [navigate]);
  useHotkeys("k", () => navigate("up"), { preventDefault: true }, [navigate]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "queries", label: "Queries" },
    { key: "auto", label: "Auto-completed" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="flex h-full flex-col border-r border-[var(--border)] bg-paper">
      {/* Search */}
      <div className="border-b border-[var(--border)] p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-white pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-[var(--border)] px-3 py-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              filter === f.key
                ? "bg-terracotta text-white"
                : "bg-cream text-ink hover:bg-terracotta/10"
            )}
          >
            {f.label}
            <span
              className={cn(
                "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                filter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-[var(--border)] text-muted-foreground"
              )}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Virtualised list */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (row.type === "header") {
              return (
                <div
                  key={`header-${row.label}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="sticky z-10 flex items-center border-b border-[var(--border)] bg-cream/80 px-3 backdrop-blur-sm"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </span>
                </div>
              );
            }

            const item = row.item;
            const isSelected = item.id === selectedItemId;
            const isHovered = item.id === hoveredId;

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => onSelectItem(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "group relative flex w-full items-start gap-2.5 border-b border-[var(--border)] px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-l-[3px] border-l-terracotta bg-cream"
                      : "hover:bg-cream/50"
                  )}
                >
                  {/* Status dot */}
                  <span
                    className={cn(
                      "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                      statusDotColour[item.status]
                    )}
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-snug text-ink">
                      {item.questionText}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {item.sisReference}
                      </span>
                      {item.autoCompleted && (
                        <Badge variant="auto" className="h-4 px-1.5 text-[10px]">
                          AUTO
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(item.lastChanged)}
                      </span>
                    </div>
                  </div>

                  {/* Quick actions on hover */}
                  {isHovered && !isSelected && onQuickAction && (
                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-[var(--border)] bg-white p-0.5 shadow-sm animate-slide-in-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(item.id, "pass");
                        }}
                        className="rounded p-1 text-forest hover:bg-forest/10"
                        title="Pass"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(item.id, "fail");
                        }}
                        className="rounded p-1 text-rose hover:bg-rose/10"
                        title="Fail"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(item.id, "query");
                        }}
                        className="rounded p-1 text-amber hover:bg-amber/10"
                        title="Query"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(item.id, "na");
                        }}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100"
                        title="N/A"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
