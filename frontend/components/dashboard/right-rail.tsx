"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { ActivityFeed } from "./activity-feed";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  label: string;
  done: boolean;
  urgent?: boolean;
}

const todayTasks: Task[] = [
  { id: "t1", label: "Review Williams Investment Super (92% complete)", done: false, urgent: true },
  { id: "t2", label: "Follow up on Smith Family Super queries (3 open)", done: false, urgent: true },
  { id: "t3", label: "Upload remaining documents for Nguyen Retirement Fund", done: false },
  { id: "t4", label: "Check Auto results for Acme Family Super Fund", done: true },
  { id: "t5", label: "Send engagement letter for O'Brien Super Fund", done: false },
];

interface RightRailProps {
  events: ActivityEvent[];
}

export function RightRail({ events }: RightRailProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [tasks, setTasks] = React.useState(todayTasks);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <div className="relative flex">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "absolute -left-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-cream shadow-sm transition-colors hover:bg-[var(--muted)] cursor-pointer",
          !isOpen && "-left-4"
        )}
        aria-label={isOpen ? "Collapse panel" : "Expand panel"}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-l border-[var(--border)] bg-cream"
          >
            <div className="w-[320px] overflow-y-auto p-5 space-y-6" style={{ maxHeight: "calc(100vh - 180px)" }}>
              {/* Today section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-terracotta" />
                  <h3 className="font-serif text-base font-semibold text-ink">
                    Today
                  </h3>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tasks.filter((t) => !t.done).length} remaining
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                          "hover:bg-[var(--muted)]",
                          task.done && "opacity-60"
                        )}
                      >
                        {task.done ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        ) : (
                          <Circle
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              task.urgent
                                ? "text-terracotta"
                                : "text-muted-foreground"
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "leading-snug",
                            task.done && "line-through"
                          )}
                        >
                          {task.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Divider */}
              <div className="border-t border-[var(--border)]" />

              {/* Activity feed */}
              <section>
                <h3 className="font-serif text-base font-semibold text-ink mb-3">
                  Recent activity
                </h3>
                <ActivityFeed events={events} maxVisible={5} />
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
