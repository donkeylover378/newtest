"use client";

import * as React from "react";
import {
  mockAudits,
  mockDashboardStats,
  mockActivityEvents,
  mockSavedViews,
} from "@/lib/mock-data";
import type { Audit, AuditStatus, SavedView } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TableView } from "@/components/dashboard/table-view";
import { KanbanView } from "@/components/dashboard/kanban-view";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { RightRail } from "@/components/dashboard/right-rail";
import { Button } from "@/components/ui/button";
import {
  Search,
  TableProperties,
  Columns3,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Stat card sparkline
// ---------------------------------------------------------------------------
function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 72;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("overflow-visible", className)}
      width={w}
      height={h}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stat cards
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  value: string;
  trend?: number[];
  trendDirection?: "up" | "down" | "neutral";
  accent?: string;
  icon?: React.ReactNode;
}

function StatCard({
  label,
  value,
  trend,
  trendDirection = "neutral",
  accent = "text-terracotta",
  icon,
}: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-cream p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("mt-1 font-serif text-2xl font-bold", accent)}>
            {value}
          </p>
        </div>
        {icon && <div className="text-muted-foreground/50">{icon}</div>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {trend && (
          <Sparkline
            data={trend}
            className={
              trendDirection === "up"
                ? "text-forest"
                : trendDirection === "down"
                  ? "text-rose"
                  : "text-muted-foreground"
            }
          />
        )}
        {trendDirection === "up" && (
          <TrendingUp className="h-4 w-4 text-forest" />
        )}
        {trendDirection === "down" && (
          <TrendingDown className="h-4 w-4 text-rose" />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View types
// ---------------------------------------------------------------------------
type ViewMode = "table" | "kanban" | "calendar";

const viewModes: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: "table", label: "Table", icon: <TableProperties className="h-4 w-4" /> },
  { key: "kanban", label: "Kanban", icon: <Columns3 className="h-4 w-4" /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const stats = mockDashboardStats;
  const [audits, setAudits] = React.useState<Audit[]>(mockAudits);
  const [activeView, setActiveView] = React.useState<ViewMode>("table");
  const [activeFilter, setActiveFilter] = React.useState<string>("sv1");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [railOpen, setRailOpen] = React.useState(true);

  // Filter audits
  const filteredAudits = React.useMemo(() => {
    const view = mockSavedViews.find((v) => v.id === activeFilter);
    let result = [...audits];

    if (view?.filters.status) {
      result = result.filter((a) => a.status === view.filters.status);
    }
    if (view?.filters.autoEnabled) {
      result = result.filter((a) => a.autoEnabled);
    }
    if (view?.filters.overdue) {
      result = result.filter(
        (a) =>
          a.status !== "signed" &&
          a.daysInStatus > 14
      );
    }
    if (view?.filters.signedRecently) {
      result = result.filter((a) => {
        if (a.status !== "signed") return false;
        const signDate = new Date(a.updatedAt);
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return signDate >= thirtyDaysAgo;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.fundName.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q) ||
          a.fundAbn.includes(q)
      );
    }

    return result;
  }, [audits, activeFilter, searchQuery]);

  // Kanban drag handler
  function handleStatusChange(auditId: string, newStatus: AuditStatus) {
    setAudits((prev) =>
      prev.map((a) =>
        a.id === auditId
          ? { ...a, status: newStatus, daysInStatus: 0 }
          : a
      )
    );
  }

  function handleRowClick(audit: Audit) {
    // Navigation would go here
    console.log("Navigate to audit:", audit.id);
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl font-bold text-ink">
              Dashboard
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRailOpen((o) => !o)}
              className="lg:hidden"
              aria-label="Toggle side panel"
            >
              {railOpen ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelRightOpen className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Funds in audit"
              value={String(stats.fundsInAudit)}
              trend={stats.fundsInAuditTrend}
              trendDirection="up"
              accent="text-ink"
            />
            <StatCard
              label="Signed this FY"
              value={String(stats.signedThisFY)}
              trend={stats.signedTrend}
              trendDirection="up"
              accent="text-forest"
            />
            <StatCard
              label="Time saved by Auto"
              value={`${stats.timeSavedHours}h`}
              trend={stats.timeSavedTrend}
              trendDirection="up"
              accent="text-gold"
              icon={<Sparkles className="h-5 w-5 text-gold/60" />}
            />
            <StatCard
              label="Plan tier"
              value={stats.planTier}
              accent="text-terracotta"
            />
          </div>

          {/* View toggle + filter bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* View toggle */}
              <div className="inline-flex rounded-lg border border-[var(--border)] bg-cream p-0.5">
                {viewModes.map((vm) => (
                  <button
                    key={vm.key}
                    onClick={() => setActiveView(vm.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                      activeView === vm.key
                        ? "bg-terracotta text-white shadow-sm"
                        : "text-muted-foreground hover:text-ink"
                    )}
                  >
                    {vm.icon}
                    {vm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter chips + search */}
            <div className="flex flex-wrap items-center gap-2">
              {mockSavedViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveFilter(view.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    activeFilter === view.id
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-[var(--border)] bg-cream text-muted-foreground hover:border-terracotta/40 hover:text-ink"
                  )}
                >
                  {view.name}
                </button>
              ))}

              {/* Search */}
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search funds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-56 rounded-lg border border-[var(--border)] bg-white pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
                />
              </div>
            </div>
          </div>

          {/* Active view */}
          <div className="animate-fade-in">
            {activeView === "table" && (
              <TableView audits={filteredAudits} onRowClick={handleRowClick} />
            )}
            {activeView === "kanban" && (
              <KanbanView
                audits={filteredAudits}
                onCardClick={handleRowClick}
                onStatusChange={handleStatusChange}
              />
            )}
            {activeView === "calendar" && (
              <CalendarView
                audits={filteredAudits}
                onAuditClick={handleRowClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="hidden lg:block">
        <RightRail events={mockActivityEvents} />
      </div>
    </div>
  );
}
