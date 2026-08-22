"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Send, CheckCircle2, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";

interface SignOffModalProps {
  open: boolean;
  onClose: () => void;
  fundName: string;
  year: number;
  autoEnabled: boolean;
  autoCharge: number;
  findingsCount: number;
  timeSavedMinutes: number;
  asicNumber: string;
}

export function SignOffModal({
  open, onClose, fundName, year, autoEnabled, autoCharge, findingsCount, timeSavedMinutes, asicNumber,
}: SignOffModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSign = () => {
    setSigned(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} className="fixed inset-0 z-50 pointer-events-none" />}

      <AnimatePresence mode="wait">
        {!signed ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-md p-8 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-ink">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-serif font-semibold mb-6">Sign audit</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Fund</span>
                <span className="font-medium">{fundName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Year</span>
                <span className="font-mono">FY{year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Opinion</span>
                <span>{findingsCount > 0 ? "Qualified" : "Unqualified"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Findings</span>
                <span>{findingsCount}</span>
              </div>
              {autoEnabled && (
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Auto charge</span>
                  <span className="font-mono font-medium">${autoCharge.toFixed(2)}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 mb-6 p-3 rounded-lg bg-cream border border-[var(--border)]">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border)] text-terracotta"
              />
              <span className="text-sm">
                I confirm I am the registered auditor for this fund (ASIC No. <span className="font-mono">{asicNumber}</span>) and accept responsibility for this report.
              </span>
            </label>

            <div className="space-y-3">
              <button
                onClick={handleSign}
                disabled={!confirmed}
                className="w-full py-3 bg-terracotta text-white font-medium rounded-lg hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign audit{autoEnabled ? ` and charge $${autoCharge.toFixed(2)}` : ""}
              </button>
              <button onClick={onClose} className="w-full py-2 text-sm text-[var(--muted-foreground)] hover:text-ink">
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-lg p-12 z-10 text-center"
          >
            <CheckCircle2 className="h-16 w-16 text-forest mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-semibold mb-2">{fundName}</h2>
            <h3 className="text-3xl font-serif font-semibold mb-4">FY{year} audit signed</h3>

            {timeSavedMinutes > 0 && (
              <p className="text-lg text-gold font-medium mb-8">
                You saved {Math.floor(timeSavedMinutes / 60)}h {timeSavedMinutes % 60}m with Auto
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)] rounded-lg text-sm hover:bg-cream transition-colors">
                <Download className="h-4 w-4" /> Audit report
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)] rounded-lg text-sm hover:bg-cream transition-colors">
                <Download className="h-4 w-4" /> Management letter
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)] rounded-lg text-sm hover:bg-cream transition-colors">
                <Send className="h-4 w-4" /> Send to trustees
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)] rounded-lg text-sm hover:bg-cream transition-colors">
                <CheckCircle2 className="h-4 w-4" /> Mark as lodged
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-2 mx-auto text-sm text-terracotta hover:text-terracotta-dark transition-colors"
            >
              Back to dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
