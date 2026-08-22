"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Breadcrumb helper                                                 */
/* ------------------------------------------------------------------ */
function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .replace(/^\/app\/?/, "")
    .split("/")
    .filter(Boolean);

  const crumbs = [
    { label: "Home", href: "/app" },
    ...segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/app/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-ink">{crumb.label}</span>
          ) : (
            <a
              href={crumb.href}
              className="text-muted-foreground hover:text-ink transition-colors"
            >
              {crumb.label}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                           */
/* ------------------------------------------------------------------ */
export function TopBar() {
  const [notificationCount] = useState(3);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-paper px-4 lg:px-6">
      {/* Left: breadcrumb */}
      <Breadcrumb />

      {/* Centre: search */}
      <div className="hidden flex-1 justify-center px-8 md:flex">
        <button
          onClick={() => {
            // Dispatch Cmd+K to open command palette
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              })
            );
          }}
          className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-muted-foreground hover:border-terracotta/30 transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search audits, funds, documents...</span>
          <kbd className="hidden rounded border border-[var(--border)] bg-paper px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
            Cmd+K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-[var(--muted)] hover:text-ink transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* New audit */}
        <button className="hidden items-center gap-1.5 rounded-lg bg-terracotta px-3.5 py-2 text-sm font-medium text-white hover:bg-terracotta-dark transition-colors cursor-pointer sm:inline-flex">
          <Plus className="h-4 w-4" />
          New audit
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white hover:bg-terracotta-dark transition-colors cursor-pointer"
            aria-label="User menu"
          >
            JM
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAvatarOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-paper p-1 shadow-lg"
                >
                  <div className="border-b border-[var(--border)] px-3 py-2.5">
                    <p className="text-sm font-medium">Jane Morrison</p>
                    <p className="text-xs text-muted-foreground">
                      jane@morrisonaudit.com.au
                    </p>
                  </div>
                  <div className="py-1">
                    <a
                      href="/app/settings"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-[var(--muted)] hover:text-ink transition-colors"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </a>
                    <a
                      href="/app/settings"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-[var(--muted)] hover:text-ink transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </a>
                  </div>
                  <div className="border-t border-[var(--border)] py-1">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose hover:bg-rose/5 transition-colors cursor-pointer">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
