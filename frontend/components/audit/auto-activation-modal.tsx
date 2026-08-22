"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Tag, Hash, GitCompare, PenTool, Sparkles } from "lucide-react";

interface AutoActivationModalProps {
  open: boolean;
  onClose: () => void;
  onActivate: () => void;
  documentsCount: number;
  totalItems: number;
  autoCapableItems: number;
  isFirstFund?: boolean;
}

const stages = [
  { icon: FileText, label: "Reading documents...", color: "text-terracotta" },
  { icon: Tag, label: "Classifying...", color: "text-amber" },
  { icon: Hash, label: "Extracting fields...", color: "text-gold" },
  { icon: GitCompare, label: "Reconciling against GL...", color: "text-forest" },
  { icon: PenTool, label: "Drafting findings...", color: "text-terracotta" },
];

export function AutoActivationModal({
  open, onClose, onActivate, documentsCount, totalItems, autoCapableItems, isFirstFund = true,
}: AutoActivationModalProps) {
  const [activating, setActivating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleActivate = () => {
    setActivating(true);
    setCurrentStage(0);
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onActivate();
            setActivating(false);
            setCurrentStage(0);
          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={!activating ? onClose : undefined} />
      <AnimatePresence mode="wait">
        {!activating ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-md p-8 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-ink">
              <X className="h-5 w-5" />
            </button>

            {isFirstFund && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 mb-4">
                <Sparkles className="h-3 w-3" /> First fund free
              </div>
            )}

            <div className="text-center my-6">
              <p className="text-5xl font-serif font-bold">{isFirstFund ? "$0" : "$49"}</p>
              {isFirstFund && <p className="text-sm text-[var(--muted-foreground)] mt-1 line-through">$49</p>}
            </div>

            <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
              Charged only at sign-off. Toggle off anytime before.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-terracotta flex-shrink-0" />
                <span>Read your {documentsCount} uploaded documents</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Tag className="h-4 w-4 text-terracotta flex-shrink-0" />
                <span>Advance up to {autoCapableItems} of your {totalItems} checklist items</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <PenTool className="h-4 w-4 text-terracotta flex-shrink-0" />
                <span>Draft findings and queries for your review</span>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleActivate} className="w-full py-3 bg-gold text-white font-medium rounded-lg hover:bg-gold-dark transition-colors">
                Activate Auto
              </button>
              <button onClick={onClose} className="w-full py-3 text-sm text-[var(--muted-foreground)] hover:text-ink transition-colors">
                Not now
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-lg p-12 text-center"
          >
            <div className="space-y-8">
              {stages.map((stage, i) => {
                const Icon = stage.icon;
                const isActive = i === currentStage;
                const isDone = i < currentStage;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isDone ? 0.4 : isActive ? 1 : 0.2,
                      y: 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-3 justify-center ${stage.color}`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                    <span className="text-lg font-medium text-white">{stage.label}</span>
                    {isDone && <span className="text-forest">&#10003;</span>}
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-12 w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gold rounded-full"
                animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
