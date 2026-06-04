"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProfile, saveFirstFund } from "@/lib/onboarding";

export function WelcomeActions() {
  const [auditorName, setAuditorName] = useState("there");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const profile = getProfile();
    if (profile?.auditorName) {
      setAuditorName(profile.auditorName.split(" ")[0]);
    }
  }, []);

  function onCsvSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImportMessage(`${file.name} selected. Review the first fund details before the audit opens.`);
    saveFirstFund({
      fundName: file.name.replace(/\.csv$/i, "").replace(/[-_]/g, " ") || "Imported SMSF",
      abn: "53 004 085 616",
      accountantEmail: "",
    });
  }

  function onSkip() {
    saveFirstFund({
      fundName: "Sample SMSF",
      abn: "53 004 085 616",
      accountantEmail: "",
    });
  }

  return (
    <section className="max-w-3xl">
      <div className="rounded-3xl border border-[var(--line)] bg-[#fffdf8] p-5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--success)]">
          Firm workspace ready
        </p>
        <h2 className="font-headline mt-3 text-4xl font-black leading-none">
          Welcome, {auditorName}. Add your first fund.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
          Start with the fund name and ABN. Accountant email is optional, so you can open the audit
          even if the client details are incomplete.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link className="primary-button w-full sm:w-auto" href="/onboarding/new-fund">
          Add first fund
        </Link>

        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept=".csv,text/csv"
          onChange={onCsvSelected}
          aria-label="Import fund details from CSV"
        />
        <button
          className="secondary-link"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          Import from CSV
        </button>

        <Link className="secondary-link" href="/audits/current" onClick={onSkip}>
          Skip and explore
        </Link>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]" aria-live="polite">
        {importMessage ||
          "Opening your first fund is free. Auto is optional and costs $49 per audit when activated."}
      </p>
    </section>
  );
}
