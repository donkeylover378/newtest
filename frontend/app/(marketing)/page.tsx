"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  X,
  ChevronDown,
  Menu,
  Sparkles,
  FileSearch,
  MessageSquare,
  Brain,
  FileBarChart,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Scroll-animated wrapper                                           */
/* ------------------------------------------------------------------ */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
const NAV_LINKS = ["Features", "Pricing", "FAQ"] as const;

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Dynamic checklist",
    desc: "Auto-generated, regulation-aware checklists that adapt to each fund's circumstances.",
  },
  {
    icon: FileSearch,
    title: "Document AI",
    desc: "Intelligent document extraction and classification powered by machine learning.",
  },
  {
    icon: MessageSquare,
    title: "Query workflow",
    desc: "Structured query management with automated follow-ups and tracking.",
  },
  {
    icon: Brain,
    title: "Auto findings",
    desc: "AI-assisted contravention detection with supporting evidence references.",
  },
  {
    icon: FileBarChart,
    title: "Audit reports",
    desc: "One-click generation of ACR, management letters and trustee reports.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance tracking",
    desc: "Stay current with ATO and APRA requirements, automatically updated.",
  },
];

const COMPARISON = [
  { label: "Dynamic SMSF checklist", us: true, them: false },
  { label: "AI document extraction", us: true, them: false },
  { label: "Integrated query workflow", us: true, them: false },
  { label: "Auto contravention detection", us: true, them: false },
  { label: "One-click ACR generation", us: true, them: false },
  { label: "Real-time compliance updates", us: true, them: false },
  { label: "SMSF-specific design", us: true, them: false },
  { label: "Cloud-based access", us: true, them: true },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is an SMSF audit?",
    a: "An SMSF audit is a mandatory annual audit of a self-managed superannuation fund conducted by an approved SMSF auditor registered with ASIC. It covers both a financial audit and a compliance audit against the Superannuation Industry (Supervision) Act 1993.",
  },
  {
    q: "Who can use AuditHub?",
    a: "AuditHub is designed for ASIC-registered SMSF auditors and their firms. You need a valid SMSF Auditor Number to create an account.",
  },
  {
    q: "How does the two-layer model work?",
    a: "The Free layer gives you a complete audit workflow with checklists, document management and query tracking. The Auto layer ($49/audit) adds AI-powered document extraction, auto-generated findings and one-click report generation.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We host on Australian data centres, and our platform is SOC 2 Type II certified. We never share your data with third parties.",
  },
  {
    q: "Can I migrate from my existing audit software?",
    a: "Yes. AuditHub supports bulk import from all major platforms including CaseWare, AuditDesktop and spreadsheet-based workflows. Our migration team will help you transition at no extra cost.",
  },
  {
    q: "What does the AI actually do?",
    a: "Our AI extracts data from financial statements, bank statements, and trust deeds. It cross-references balances, identifies potential contraventions, and drafts findings. Every AI output is clearly marked and requires auditor sign-off.",
  },
  {
    q: "Is there a contract or lock-in period?",
    a: "No. The Free layer is free forever. The Auto layer is pay-per-audit with no minimum commitment. You can cancel or switch at any time.",
  },
  {
    q: "How do I get started?",
    a: "Sign up with your ASIC SMSF Auditor Number, verify your identity, and you can start your first audit in under five minutes. We offer a guided onboarding tour to walk you through every feature.",
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion item                                                    */
/* ------------------------------------------------------------------ */
function FAQItem({ item, open, toggle }: { item: (typeof FAQ)[0]; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between py-5 text-left font-serif text-lg font-semibold text-ink hover:text-terracotta transition-colors cursor-pointer"
      >
        {item.q}
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */
export default function MarketingPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ---- Sticky nav ---- */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-serif text-2xl font-bold text-ink">
            AuditHub
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
              >
                {l}
              </a>
            ))}
            <Link
              href="/signup"
              className="rounded-lg bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-terracotta-dark transition-colors"
            >
              Start free
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-[var(--border)] md:hidden"
            >
              <div className="flex flex-col gap-3 px-4 py-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    onClick={() => setMobileNav(false)}
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <FadeIn>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
              <Sparkles className="h-3.5 w-3.5" /> Built for Australian SMSF auditors
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              The audit platform built for{" "}
              <span className="text-terracotta">SMSF auditors</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Two layers, one platform. Start with a complete free audit workflow,
              then unlock AI-powered automation when you are ready.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-terracotta-dark transition-colors"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-base font-medium text-ink hover:bg-cream transition-colors"
              >
                See features
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---- Two-layer section ---- */}
      <section className="bg-cream py-20" id="layers">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
              Two layers. Your choice.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Every auditor gets the complete workflow for free. Add AI
              automation on a per-audit basis when it makes sense.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Free */}
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-[var(--border)] bg-paper p-8 shadow-sm">
                <span className="inline-block rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                  Free layer
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold">Complete workflow</h3>
                <p className="mt-2 text-muted-foreground">
                  Everything you need to run a thorough SMSF audit, from
                  engagement to sign-off.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    "Dynamic compliance checklist",
                    "Document management",
                    "Query workflow",
                    "Trustee communication",
                    "Audit report generation",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <span className="font-serif text-3xl font-bold">$0</span>
                  <span className="ml-1 text-muted-foreground">/ forever</span>
                </div>
              </div>
            </FadeIn>

            {/* Auto */}
            <FadeIn delay={0.2}>
              <div className="relative rounded-2xl border-2 border-terracotta bg-paper p-8 shadow-sm">
                <span className="absolute -top-3 right-6 inline-block rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
                <span className="inline-block rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                  Auto layer
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold">AI-powered</h3>
                <p className="mt-2 text-muted-foreground">
                  Let AI handle the heavy lifting. Extraction, cross-referencing
                  and draft findings, all reviewed by you.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    "Everything in Free",
                    "AI document extraction",
                    "Auto contravention detection",
                    "One-click ACR generation",
                    "Priority support",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <span className="font-serif text-3xl font-bold">$49</span>
                  <span className="ml-1 text-muted-foreground">/ audit</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="py-20" id="features">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
              Everything you need, nothing you don&rsquo;t
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Purpose-built for SMSF auditors. No generic audit bloat.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="rounded-xl border border-[var(--border)] bg-cream p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <f.icon className="h-8 w-8 text-terracotta" />
                  <h3 className="mt-4 font-serif text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Comparison table ---- */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
              AuditHub vs legacy tools
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
              See how a purpose-built SMSF platform compares to one-size-fits-all
              audit software.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-xl border border-[var(--border)] bg-paper">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center font-medium text-terracotta">
                      AuditHub
                    </th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">
                      Legacy tools
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.label}
                      className={cn(
                        i < COMPARISON.length - 1 && "border-b border-[var(--border)]"
                      )}
                    >
                      <td className="px-6 py-3.5">{row.label}</td>
                      <td className="px-6 py-3.5 text-center">
                        {row.us ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-forest" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-rose" />
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {row.them ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-forest" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-rose" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section className="py-20" id="pricing">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
              No subscriptions, no lock-in. Pay only for what you use.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <FadeIn delay={0.1}>
              <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-cream p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-bold">Free</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The complete SMSF audit workflow, free forever.
                </p>
                <div className="mt-6">
                  <span className="font-serif text-4xl font-bold">$0</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {[
                    "Unlimited audits",
                    "Dynamic checklist",
                    "Document management",
                    "Query workflow",
                    "Report generation",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-forest" /> {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block rounded-lg border border-[var(--border)] py-3 text-center text-sm font-medium hover:bg-paper transition-colors"
                >
                  Get started
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative flex flex-col rounded-2xl border-2 border-terracotta bg-cream p-8 shadow-sm">
                <span className="absolute -top-3 right-6 inline-block rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </span>
                <h3 className="font-serif text-2xl font-bold">Auto</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI-powered automation on a per-audit basis.
                </p>
                <div className="mt-6">
                  <span className="font-serif text-4xl font-bold">$49</span>
                  <span className="ml-1 text-muted-foreground">/ audit</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {[
                    "Everything in Free",
                    "AI document extraction",
                    "Auto contravention detection",
                    "One-click ACR generation",
                    "Priority support",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-terracotta" /> {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block rounded-lg bg-terracotta py-3 text-center text-sm font-medium text-white hover:bg-terracotta-dark transition-colors"
                >
                  Start free, upgrade anytime
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="bg-cream py-20" id="faq">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
              Frequently asked questions
            </h2>
          </FadeIn>

          <div className="mt-12">
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <FAQItem
                  item={item}
                  open={openFAQ === i}
                  toggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[var(--border)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <span className="font-serif text-xl font-bold">AuditHub</span>
              <p className="mt-1 text-sm text-muted-foreground">
                The audit platform built for SMSF auditors.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-ink transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-ink transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-ink transition-colors">
                FAQ
              </a>
              <Link href="/signup" className="hover:text-ink transition-colors">
                Sign up
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
                <ShieldCheck className="h-3 w-3" /> SOC 2 Type II
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
                <ShieldCheck className="h-3 w-3" /> Australian hosted
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AuditHub Pty Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ---- Mobile fixed CTA ---- */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-terracotta-dark transition-colors"
        >
          Start free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
