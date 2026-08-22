"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Tour steps                                                        */
/* ------------------------------------------------------------------ */
const TOUR_STEPS = [
  {
    target: "[data-tour='dashboard']",
    title: "Your Dashboard",
    description:
      "Get a bird's-eye view of all your active audits, upcoming deadlines, and recent activity. Everything you need, at a glance.",
  },
  {
    target: "[data-tour='checklist']",
    title: "Dynamic Checklist",
    description:
      "Each audit gets a regulation-aware checklist that adapts to the fund's circumstances. Tick items off as you go, and nothing gets missed.",
  },
  {
    target: "[data-tour='evidence']",
    title: "Evidence & Documents",
    description:
      "Upload, organise and tag documents. Our AI can extract key data points and link them directly to checklist items.",
  },
  {
    target: "[data-tour='ai-assistant']",
    title: "AI Assistant",
    description:
      "Let AI cross-reference balances, flag potential contraventions, and draft findings. Every output is clearly marked for your review.",
  },
  {
    target: "[data-tour='signoff']",
    title: "Sign-off & Reports",
    description:
      "When you're ready, generate your ACR, management letter and trustee report with one click. Review, sign and lodge.",
  },
];

const STORAGE_KEY = "audithub-tour-completed";
const STEP_KEY = "audithub-tour-step";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Check if tour was already completed
  useEffect(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        const savedStep = localStorage.getItem(STEP_KEY);
        setStep(savedStep ? parseInt(savedStep, 10) : 0);
        setActive(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Find and spotlight the target element
  useEffect(() => {
    if (!active) return;

    const currentStep = TOUR_STEPS[step];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [active, step]);

  // Persist step
  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(step));
    } catch {
      // ignore
    }
  }, [step]);

  const dismiss = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.removeItem(STEP_KEY);
    } catch {
      // ignore
    }
  }, []);

  const next = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }, [step, dismiss]);

  const back = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  if (!active) return null;

  const currentStep = TOUR_STEPS[step];
  const padding = 8;

  // Tooltip positioning
  const tooltipStyle: React.CSSProperties = targetRect
    ? {
        position: "fixed",
        top: targetRect.bottom + padding + 12,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 360)),
        zIndex: 10001,
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
      };

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Overlay with spotlight cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000]"
            style={{ pointerEvents: "auto" }}
          >
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <mask id="tour-mask">
                  <rect width="100%" height="100%" fill="white" />
                  {targetRect && (
                    <rect
                      x={targetRect.left - padding}
                      y={targetRect.top - padding}
                      width={targetRect.width + padding * 2}
                      height={targetRect.height + padding * 2}
                      rx={8}
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(15,23,42,0.6)"
                mask="url(#tour-mask)"
              />
            </svg>

            {/* Spotlight border */}
            {targetRect && (
              <div
                className="absolute rounded-lg border-2 border-terracotta"
                style={{
                  left: targetRect.left - padding,
                  top: targetRect.top - padding,
                  width: targetRect.width + padding * 2,
                  height: targetRect.height + padding * 2,
                }}
              />
            )}
          </motion.div>

          {/* Tooltip */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={tooltipStyle}
            className="w-80 rounded-xl border border-[var(--border)] bg-paper p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {currentStep.title}
              </h3>
              <button
                onClick={dismiss}
                className="rounded-md p-1 text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>

            {/* Step indicator */}
            <div className="mt-4 flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === step
                      ? "w-6 bg-terracotta"
                      : "w-1.5 bg-[var(--border)]"
                  )}
                />
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                {step + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={dismiss}
                className="text-sm text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={back}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>
                )}
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1 rounded-lg bg-terracotta px-3 py-1.5 text-sm font-medium text-white hover:bg-terracotta-dark transition-colors cursor-pointer"
                >
                  {step === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                  {step < TOUR_STEPS.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
