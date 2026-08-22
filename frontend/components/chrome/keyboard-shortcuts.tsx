"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

/* ------------------------------------------------------------------ */
/*  Shortcut data                                                     */
/* ------------------------------------------------------------------ */
const SHORTCUT_GROUPS = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Cmd", "1"], desc: "Go to Dashboard" },
      { keys: ["Cmd", "2"], desc: "Go to Audits" },
      { keys: ["Cmd", "3"], desc: "Go to Funds" },
      { keys: ["Cmd", "4"], desc: "Go to Documents" },
      { keys: ["Cmd", "5"], desc: "Go to Queries" },
      { keys: ["Cmd", "6"], desc: "Go to Reports" },
      { keys: ["Cmd", "7"], desc: "Go to Settings" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["Cmd", "K"], desc: "Open command palette" },
      { keys: ["Cmd", "N"], desc: "New audit" },
      { keys: ["Cmd", "S"], desc: "Save changes" },
      { keys: ["Cmd", "Enter"], desc: "Submit / confirm" },
    ],
  },
  {
    title: "Audit workflow",
    shortcuts: [
      { keys: ["Cmd", "Shift", "C"], desc: "Toggle checklist" },
      { keys: ["Cmd", "Shift", "D"], desc: "Upload document" },
      { keys: ["Cmd", "Shift", "Q"], desc: "Create query" },
      { keys: ["Cmd", "Shift", "F"], desc: "Add finding" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["?"], desc: "Show keyboard shortcuts" },
      { keys: ["Esc"], desc: "Close dialog / overlay" },
      { keys: ["/"], desc: "Focus search" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useHotkeys(
    "shift+/",
    (e) => {
      e.preventDefault();
      setOpen(true);
    },
    { enableOnFormTags: false }
  );

  useHotkeys(
    "escape",
    () => {
      if (open) setOpen(false);
    },
    { enableOnFormTags: true, enabled: open }
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-paper p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">
                Keyboard shortcuts
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-[var(--muted)] hover:text-ink transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((sc) => (
                      <div
                        key={sc.desc}
                        className="flex items-center justify-between rounded-lg py-1.5"
                      >
                        <span className="text-sm text-ink">{sc.desc}</span>
                        <div className="flex items-center gap-1">
                          {sc.keys.map((k) => (
                            <kbd
                              key={k}
                              className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 font-mono text-[11px] text-muted-foreground"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Press <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1 py-0.5 text-[10px] font-mono">Esc</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
