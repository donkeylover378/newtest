"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkAbn,
  type CheckState,
  formatAbn,
  getFirstFund,
  saveFirstFund,
} from "@/lib/onboarding";

type FundFormState = {
  fundName: string;
  abn: string;
  accountantEmail: string;
};

const initialForm: FundFormState = {
  fundName: "",
  abn: "",
  accountantEmail: "",
};

export function FundForm() {
  const router = useRouter();
  const [form, setForm] = useState<FundFormState>(initialForm);
  const [abnState, setAbnState] = useState<CheckState>("idle");
  const [abnMessage, setAbnMessage] = useState(
    "Enter the fund ABN. AuditHub checks the public ABN format before you continue.",
  );
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const imported = getFirstFund();
    if (imported) {
      setForm({
        fundName: imported.fundName,
        abn: formatAbn(imported.abn),
        accountantEmail: imported.accountantEmail ?? "",
      });
    }
  }, []);

  useEffect(() => {
    const formatted = formatAbn(form.abn);
    if (!formatted) {
      const result = checkAbn(formatted);
      setAbnState(result.state);
      setAbnMessage(result.message);
      return;
    }

    setAbnState("checking");
    setAbnMessage("Checking ABN format...");

    const timer = window.setTimeout(() => {
      const result = checkAbn(formatted);
      setAbnState(result.state);
      setAbnMessage(result.message);
    }, 360);

    return () => window.clearTimeout(timer);
  }, [form.abn]);

  const accountantEmailIsValid = useMemo(() => {
    if (!form.accountantEmail.trim()) {
      return true;
    }

    return /.+@.+\..+/.test(form.accountantEmail);
  }, [form.accountantEmail]);

  const canStart =
    form.fundName.trim().length > 2 && abnState === "valid" && accountantEmailIsValid;

  function updateField(field: keyof FundFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "abn" ? formatAbn(value) : value,
    }));
    setSaveMessage("");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canStart) {
      setSaveMessage("Complete the fund name and valid ABN, then start the audit.");
      return;
    }

    saveFirstFund({
      fundName: form.fundName.trim(),
      abn: form.abn,
      accountantEmail: form.accountantEmail.trim() || undefined,
    });
    setSaveMessage("Fund saved. Opening the audit working surface.");
    router.push("/audits/current");
  }

  return (
    <form className="max-w-3xl" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5">
        <label className="space-y-2">
          <span className="field-label">Fund name</span>
          <input
            className="input"
            name="fundName"
            autoComplete="organization"
            value={form.fundName}
            onChange={(event) => updateField("fundName", event.target.value)}
            required
            aria-describedby="fund-help"
          />
          <span className="field-hint" id="fund-help">
            Use the legal fund name from the trust deed.
          </span>
        </label>

        <label className="space-y-2">
          <span className="field-label">ABN</span>
          <input
            className="input"
            name="abn"
            inputMode="numeric"
            autoComplete="off"
            value={form.abn}
            onChange={(event) => updateField("abn", event.target.value)}
            required
            aria-describedby="abn-status"
          />
          <span
            className={`block text-sm leading-6 ${
              abnState === "valid"
                ? "text-[var(--success)]"
                : abnState === "invalid"
                  ? "text-[var(--danger)]"
                  : "text-[var(--muted)]"
            }`}
            id="abn-status"
            aria-live="polite"
          >
            {abnMessage}
          </span>
        </label>

        <label className="space-y-2">
          <span className="field-label">Accountant email <span className="text-[var(--muted)]">(optional)</span></span>
          <input
            className="input"
            name="accountantEmail"
            type="email"
            autoComplete="email"
            value={form.accountantEmail}
            onChange={(event) => updateField("accountantEmail", event.target.value)}
            aria-describedby="accountant-help"
          />
          <span
            className={`field-hint ${accountantEmailIsValid ? "" : "text-[var(--danger)]"}`}
            id="accountant-help"
          >
            {accountantEmailIsValid
              ? "Leave blank if you will raise queries later."
              : "Enter a valid email address or leave this blank."}
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="primary-button w-full sm:w-auto" type="submit" disabled={!canStart}>
          Start audit
        </button>
        <Link className="secondary-link" href="/onboarding/welcome">
          Back
        </Link>
        <p className="text-sm leading-6 text-[var(--muted)]" aria-live="polite">
          {saveMessage || "No charge. Auto remains off until you choose the $49 activation inside the audit."}
        </p>
      </div>
    </form>
  );
}
