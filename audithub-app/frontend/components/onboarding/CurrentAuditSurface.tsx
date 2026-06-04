"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFirstFund, getProfile, type AuditorProfile, type FirstFund } from "@/lib/onboarding";

const checklist = [
  { id: "A1", title: "Engagement letter signed", state: "To do" },
  { id: "A2", title: "Trust deed and variations uploaded", state: "To do" },
  { id: "B1", title: "Member balances agree to financials", state: "To do" },
  { id: "C1", title: "Investment strategy reviewed", state: "To do" },
];

export function CurrentAuditSurface() {
  const [fund, setFund] = useState<FirstFund>({
    fundName: "Sample SMSF",
    abn: "53 004 085 616",
  });
  const [profile, setProfile] = useState<AuditorProfile | null>(null);
  const [uploadMessage, setUploadMessage] = useState("No documents attached yet.");

  useEffect(() => {
    setFund(getFirstFund() ?? { fundName: "Sample SMSF", abn: "53 004 085 616" });
    setProfile(getProfile());
  }, []);

  function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    setUploadMessage(`${files.length} document${files.length === 1 ? "" : "s"} attached to A1.`);
  }

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-7xl">
        <header className="product-card mb-5 rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link className="text-sm font-black tracking-[-0.04em]" href="/onboarding/signup">
                AuditHub
              </Link>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[var(--accent-orange)]">
                Audit working surface
              </p>
              <h1 className="font-headline mt-2 text-4xl font-black leading-none sm:text-5xl">
                {fund.fundName}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                ABN {fund.abn}. Start by attaching evidence to the selected checklist item.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <span className="status-pill">0/4 items complete · 0 queries open</span>
              <Link className="status-pill" href="/audits/current#audit-trail">
                3 hash-chained events
              </Link>
              <span className="status-pill">Hosted in Sydney · AWS ap-southeast-2</span>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="product-card rounded-[28px] p-4">
            <div className="sticky top-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                Checklist
              </p>
              <div className="mt-4 h-2 rounded-full bg-[var(--cream-deep)]" aria-label="0 of 4 checklist items complete">
                <div className="h-2 w-0 rounded-full bg-[var(--accent-orange)]" />
              </div>
              <ol className="mt-5 space-y-2">
                {checklist.map((item, index) => (
                  <li
                    className={`rounded-2xl border p-3 ${
                      index === 0
                        ? "border-[var(--accent-orange)] bg-[#fff4e8]"
                        : "border-[var(--line)] bg-[#fffdf8]"
                    }`}
                    key={item.id}
                  >
                    <p className="text-xs font-black text-[var(--muted)]">{item.id}</p>
                    <p className="mt-1 text-sm font-bold leading-5">{item.title}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">{item.state}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <section className="product-card rounded-[28px] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
              Working paper A1
            </p>
            <h2 className="font-headline mt-2 text-4xl font-black leading-none">
              Engagement letter signed
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
              Attach the engagement letter or mark this item not applicable. AuditHub records each
              action in the hash-chained audit trail.
            </p>

            <div className="mt-6 rounded-3xl border-2 border-dashed border-[var(--line)] bg-[#fffdf8] p-6">
              <label className="flex cursor-pointer flex-col items-start gap-3">
                <span className="text-sm font-black">Evidence</span>
                <span className="text-sm leading-6 text-[var(--ink-soft)]">
                  Drop files here when upload is enabled, or choose files now.
                </span>
                <input className="sr-only" type="file" multiple onChange={onUpload} />
                <span className="primary-button">Upload evidence</span>
              </label>
              <p className="mt-4 text-sm text-[var(--muted)]" aria-live="polite">
                {uploadMessage}
              </p>
            </div>

            <label className="mt-6 block space-y-2">
              <span className="field-label">Notes</span>
              <input className="input" placeholder="Record what you checked for this item." />
            </label>
          </section>

          <aside className="product-card rounded-[28px] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
              Auto
            </p>
            <h2 className="font-headline mt-2 text-3xl font-black leading-none">
              Auto is off for this audit.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
              Activate Auto for $49 when documents are uploaded. It will classify evidence, extract
              key figures, reconcile checklist items, and draft findings for review.
            </p>
            <button className="primary-button mt-6 w-full" type="button">
              Activate Auto for $49
            </button>
            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#fffdf8] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">
                Sign-off identity
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                {profile
                  ? `${profile.auditorName}, SMSF Auditor #${profile.asicNumber}`
                  : "ASIC auditor details will appear here after signup."}
              </p>
            </div>
          </aside>
        </section>

        <section className="product-card mt-5 rounded-[28px] p-5" id="audit-trail">
          <h2 className="font-headline text-3xl font-black leading-none">Audit trail</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                <tr>
                  <th className="border-b border-[var(--line)] py-3">Time</th>
                  <th className="border-b border-[var(--line)] py-3">Event</th>
                  <th className="border-b border-[var(--line)] py-3">Actor</th>
                  <th className="border-b border-[var(--line)] py-3">Hash</th>
                </tr>
              </thead>
              <tbody>
                {["Workspace created", "Fund created", "Audit opened"].map((event, index) => (
                  <tr key={event}>
                    <td className="border-b border-[var(--line)] py-3">Today</td>
                    <td className="border-b border-[var(--line)] py-3">{event}</td>
                    <td className="border-b border-[var(--line)] py-3">
                      {profile?.auditorName ?? "Auditor"}
                    </td>
                    <td className="border-b border-[var(--line)] py-3 font-mono">
                      ah-{index + 1}-7f2c
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
