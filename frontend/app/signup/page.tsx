"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Password strength                                                 */
/* ------------------------------------------------------------------ */
function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  colour: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", colour: "bg-rose" };
  if (score <= 2) return { score, label: "Fair", colour: "bg-amber" };
  if (score <= 3) return { score, label: "Good", colour: "bg-gold" };
  return { score, label: "Strong", colour: "bg-forest" };
}

/* ------------------------------------------------------------------ */
/*  Mock ASIC verification                                            */
/* ------------------------------------------------------------------ */
const MOCK_NAMES: Record<string, string> = {
  "12345678": "Jane Morrison",
  "87654321": "Robert Chen",
  "11223344": "Sarah Patel",
};

function useDebouncedAsicCheck(asicNumber: string) {
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "checking" }
    | { status: "verified"; name: string }
    | { status: "error" }
  >({ status: "idle" });

  useEffect(() => {
    if (asicNumber.length === 0) {
      setState({ status: "idle" });
      return;
    }

    if (asicNumber.length < 8) {
      // Don't check yet while typing, but set up a debounce to show error
      const timer = setTimeout(() => {
        setState({ status: "error" });
      }, 500);
      return () => clearTimeout(timer);
    }

    setState({ status: "checking" });

    const timer = setTimeout(() => {
      const name = MOCK_NAMES[asicNumber];
      if (name) {
        setState({ status: "verified", name });
      } else {
        // For any 8+ digit number not in mock, simulate a successful lookup
        setState({
          status: "verified",
          name: "Auditor #" + asicNumber,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [asicNumber]);

  return state;
}

/* ------------------------------------------------------------------ */
/*  Signup page                                                       */
/* ------------------------------------------------------------------ */
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [firmName, setFirmName] = useState("");
  const [asicNumber, setAsicNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const asicState = useDebouncedAsicCheck(asicNumber);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    isEmailValid &&
    firmName.trim().length > 0 &&
    asicState.status === "verified" &&
    password.length >= 8;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;
      // placeholder submit
    },
    [isFormValid]
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      {/* Blurred background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-terracotta/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/5 blur-3xl" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-paper p-8 shadow-xl"
      >
        <div className="text-center">
          <Link href="/" className="font-serif text-2xl font-bold text-ink">
            AuditHub
          </Link>
          <h1 className="mt-2 font-serif text-xl font-semibold">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start auditing in under five minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-paper px-3 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
              placeholder="you@firm.com.au"
              autoComplete="email"
            />
          </div>

          {/* Firm name */}
          <div>
            <label
              htmlFor="firm"
              className="mb-1.5 block text-sm font-medium"
            >
              Firm name
            </label>
            <input
              id="firm"
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-paper px-3 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
              placeholder="e.g. Morrison Audit Services"
              autoComplete="organization"
            />
          </div>

          {/* ASIC SMSF Auditor Number */}
          <div>
            <label
              htmlFor="asic"
              className="mb-1.5 block text-sm font-medium"
            >
              ASIC SMSF Auditor Number
            </label>
            <input
              id="asic"
              type="text"
              inputMode="numeric"
              value={asicNumber}
              onChange={(e) =>
                setAsicNumber(e.target.value.replace(/\D/g, ""))
              }
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-paper px-3 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
              placeholder="8-digit number"
              autoComplete="off"
            />
            <AnimatePresence mode="wait">
              {asicState.status === "checking" && (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Verifying...
                </motion.div>
              )}
              {asicState.status === "verified" && (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-forest"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified &mdash; {asicState.name}
                </motion.div>
              )}
              {asicState.status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-rose"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Invalid number.{" "}
                  <a
                    href="https://asic.gov.au/online-services/search-asics-registers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Check the ASIC register
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-paper px-3 pr-10 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((seg) => (
                    <div
                      key={seg}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-200",
                        seg <= strength.score
                          ? strength.colour
                          : "bg-[var(--border)]"
                      )}
                    />
                  ))}
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs font-medium",
                    strength.score <= 1
                      ? "text-rose"
                      : strength.score <= 2
                        ? "text-amber"
                        : strength.score <= 3
                          ? "text-gold"
                          : "text-forest"
                  )}
                >
                  {strength.label}
                </p>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!isFormValid}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={cn(
              "h-11 w-full rounded-lg text-sm font-medium transition-colors cursor-pointer",
              isFormValid
                ? "bg-terracotta text-white hover:bg-terracotta-dark"
                : "bg-[var(--border)] text-muted-foreground cursor-not-allowed"
            )}
          >
            Create account
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-terracotta hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
