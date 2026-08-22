"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  MessageSquare,
  FileBarChart,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

/* ------------------------------------------------------------------ */
/*  Nav items                                                         */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/app", shortcut: 1 },
  { label: "Audits", icon: ClipboardCheck, href: "/app/audits", shortcut: 2 },
  { label: "Funds", icon: Building2, href: "/app/funds", shortcut: 3 },
  { label: "Documents", icon: FileText, href: "/app/documents", shortcut: 4 },
  { label: "Queries", icon: MessageSquare, href: "/app/queries", shortcut: 5 },
  { label: "Reports", icon: FileBarChart, href: "/app/reports", shortcut: 6 },
  { label: "Settings", icon: Settings, href: "/app/settings", shortcut: 7 },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Keyboard shortcuts: Cmd+1 through Cmd+7
  NAV_ITEMS.forEach((item) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(
      `meta+${item.shortcut}`,
      (e) => {
        e.preventDefault();
        window.location.href = item.href;
      },
      { enableOnFormTags: false }
    );
  });

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex h-screen flex-col border-r border-[var(--border)] bg-cream"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-serif text-lg font-bold text-ink"
              >
                AuditHub
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-[var(--border)] hover:text-ink transition-colors cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const link = (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-muted-foreground hover:bg-[var(--muted)] hover:text-ink"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-terracotta"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <item.icon className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      key={item.label}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip.Root key={item.label}>
                  <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="z-50 rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium text-white shadow-md"
                  >
                    {item.label}
                    <Tooltip.Arrow className="fill-ink" />
                  </Tooltip.Content>
                </Tooltip.Root>
              );
            }

            return link;
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[var(--border)] p-3">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">
              JM
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="truncate text-sm font-medium">Jane Morrison</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Morrison Audit Services
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div
            className={cn(
              "mt-3 flex items-center",
              collapsed ? "justify-center gap-1" : "gap-2"
            )}
          >
            <button
              onClick={toggleDark}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-[var(--border)] hover:text-ink transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              className="rounded-md p-1.5 text-muted-foreground hover:bg-[var(--border)] hover:text-ink transition-colors cursor-pointer"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </Tooltip.Provider>
  );
}
