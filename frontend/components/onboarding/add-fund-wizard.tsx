"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  ChevronRight,
  ChevronLeft,
  FileText,
  UserCheck,
  ClipboardList,
  FolderUp,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface WizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (data: WizardData) => void;
}

interface WizardData {
  importMethod: "import" | "manual";
  fundName: string;
  abn: string;
  trusteeType: "individual" | "corporate";
  accountantName: string;
  accountantEmail: string;
  accountantPhone: string;
  auditYear: string;
  engagementDate: string;
  auditType: "full" | "limited";
  documents: File[];
}

/* ------------------------------------------------------------------ */
/*  Steps config                                                      */
/* ------------------------------------------------------------------ */
const STEPS = [
  { label: "Fund details", icon: FileText },
  { label: "Accountant", icon: UserCheck },
  { label: "Audit details", icon: ClipboardList },
  { label: "Documents", icon: FolderUp },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) =>
  String(CURRENT_YEAR - i)
);

/* ------------------------------------------------------------------ */
/*  Slide animation variants                                          */
/* ------------------------------------------------------------------ */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function AddFundWizard({ open, onClose, onComplete }: WizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<WizardData>({
    importMethod: "manual",
    fundName: "",
    abn: "",
    trusteeType: "individual",
    accountantName: "",
    accountantEmail: "",
    accountantPhone: "",
    auditYear: String(CURRENT_YEAR),
    engagementDate: "",
    auditType: "full",
    documents: [],
  });

  const update = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  /* Validation */
  const validateStep = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!data.fundName.trim()) errs.fundName = "Fund name is required";
      if (!data.abn.trim()) errs.abn = "ABN is required";
      else if (data.abn.replace(/\s/g, "").length !== 11)
        errs.abn = "ABN must be 11 digits";
    } else if (step === 1) {
      if (!data.accountantName.trim())
        errs.accountantName = "Accountant name is required";
      if (!data.accountantEmail.trim())
        errs.accountantEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.accountantEmail))
        errs.accountantEmail = "Invalid email address";
    } else if (step === 2) {
      if (!data.engagementDate) errs.engagementDate = "Date is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, data]);

  const goNext = useCallback(() => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onComplete?.(data);
      onClose();
    }
  }, [step, validateStep, data, onComplete, onClose]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }, [step]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        update("documents", [...data.documents, ...Array.from(files)]);
      }
    },
    [data.documents, update]
  );

  const removeFile = useCallback(
    (index: number) => {
      update(
        "documents",
        data.documents.filter((_, i) => i !== index)
      );
    },
    [data.documents, update]
  );

  /* Field helper */
  const fieldClass = (key: string) =>
    cn(
      "h-10 w-full rounded-lg border bg-paper px-3 text-sm outline-none transition-colors",
      errors[key]
        ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/20"
        : "border-[var(--border)] focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
    );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[480px] flex-col border-l border-[var(--border)] bg-paper shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 className="font-serif text-lg font-bold">Add new fund</h2>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-[var(--muted)] hover:text-ink transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="border-b border-[var(--border)] px-6 py-3">
              <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s.label} className="flex flex-1 items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                        i < step
                          ? "bg-forest text-white"
                          : i === step
                            ? "bg-terracotta text-white"
                            : "bg-[var(--muted)] text-muted-foreground"
                      )}
                    >
                      {i < step ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors",
                          i < step ? "bg-forest" : "bg-[var(--border)]"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Step {step + 1} of {STEPS.length}: {STEPS[step].label}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 0: Fund details */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => update("importMethod", "import")}
                          className={cn(
                            "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors cursor-pointer",
                            data.importMethod === "import"
                              ? "border-terracotta bg-terracotta/5 text-terracotta"
                              : "border-[var(--border)] hover:border-terracotta/30"
                          )}
                        >
                          <Upload className="h-5 w-5" />
                          Import
                        </button>
                        <button
                          type="button"
                          onClick={() => update("importMethod", "manual")}
                          className={cn(
                            "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors cursor-pointer",
                            data.importMethod === "manual"
                              ? "border-terracotta bg-terracotta/5 text-terracotta"
                              : "border-[var(--border)] hover:border-terracotta/30"
                          )}
                        >
                          <FileText className="h-5 w-5" />
                          Manual entry
                        </button>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Fund name
                        </label>
                        <input
                          type="text"
                          value={data.fundName}
                          onChange={(e) => update("fundName", e.target.value)}
                          className={fieldClass("fundName")}
                          placeholder="e.g. Morrison Family Super Fund"
                        />
                        {errors.fundName && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-rose">
                            <AlertCircle className="h-3 w-3" /> {errors.fundName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          ABN
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={data.abn}
                          onChange={(e) =>
                            update(
                              "abn",
                              e.target.value.replace(/[^\d\s]/g, "")
                            )
                          }
                          className={fieldClass("abn")}
                          placeholder="XX XXX XXX XXX"
                        />
                        {errors.abn && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-rose">
                            <AlertCircle className="h-3 w-3" /> {errors.abn}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Trustee type
                        </label>
                        <div className="flex gap-3">
                          {(["individual", "corporate"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => update("trusteeType", t)}
                              className={cn(
                                "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer capitalize",
                                data.trusteeType === t
                                  ? "border-terracotta bg-terracotta/5 text-terracotta"
                                  : "border-[var(--border)] hover:border-terracotta/30"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Accountant contact */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Accountant name
                        </label>
                        <input
                          type="text"
                          value={data.accountantName}
                          onChange={(e) =>
                            update("accountantName", e.target.value)
                          }
                          className={fieldClass("accountantName")}
                          placeholder="Full name"
                        />
                        {errors.accountantName && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-rose">
                            <AlertCircle className="h-3 w-3" />{" "}
                            {errors.accountantName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          value={data.accountantEmail}
                          onChange={(e) =>
                            update("accountantEmail", e.target.value)
                          }
                          className={fieldClass("accountantEmail")}
                          placeholder="accountant@firm.com.au"
                        />
                        {errors.accountantEmail && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-rose">
                            <AlertCircle className="h-3 w-3" />{" "}
                            {errors.accountantEmail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          value={data.accountantPhone}
                          onChange={(e) =>
                            update("accountantPhone", e.target.value)
                          }
                          className={fieldClass("accountantPhone")}
                          placeholder="04XX XXX XXX"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Audit details */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Audit year
                        </label>
                        <select
                          value={data.auditYear}
                          onChange={(e) => update("auditYear", e.target.value)}
                          className={fieldClass("auditYear")}
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              FY {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Engagement date
                        </label>
                        <input
                          type="date"
                          value={data.engagementDate}
                          onChange={(e) =>
                            update("engagementDate", e.target.value)
                          }
                          className={fieldClass("engagementDate")}
                        />
                        {errors.engagementDate && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-rose">
                            <AlertCircle className="h-3 w-3" />{" "}
                            {errors.engagementDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Audit type
                        </label>
                        <div className="flex gap-3">
                          {(["full", "limited"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => update("auditType", t)}
                              className={cn(
                                "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer capitalize",
                                data.auditType === t
                                  ? "border-terracotta bg-terracotta/5 text-terracotta"
                                  : "border-[var(--border)] hover:border-terracotta/30"
                              )}
                            >
                              {t} audit
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div
                        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] p-8 hover:border-terracotta/30 transition-colors"
                        onClick={() =>
                          document.getElementById("wizard-file-input")?.click()
                        }
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            Drop files here or click to browse
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            PDF, images, spreadsheets up to 25 MB each
                          </p>
                        </div>
                        <input
                          id="wizard-file-input"
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                          onChange={handleFileChange}
                        />
                      </div>

                      {data.documents.length > 0 && (
                        <div className="space-y-2">
                          {data.documents.map((file, i) => (
                            <div
                              key={`${file.name}-${i}`}
                              className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <button
                                onClick={() => removeFile(i)}
                                className="rounded-md p-1 text-muted-foreground hover:text-rose transition-colors cursor-pointer"
                                aria-label={`Remove ${file.name}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        You can also upload documents later from the audit
                        workspace. Common documents include financial statements,
                        bank statements, trust deed, and member statements.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
              {step > 0 ? (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={goNext}
                className="inline-flex items-center gap-1.5 rounded-lg bg-terracotta px-4 py-2.5 text-sm font-medium text-white hover:bg-terracotta-dark transition-colors cursor-pointer"
              >
                {step === STEPS.length - 1 ? (
                  <>
                    <Check className="h-4 w-4" /> Create fund
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
