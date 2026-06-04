"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkAsicAuditorNumber,
  type CheckState,
  formatAsicNumber,
  saveProfile,
} from "@/lib/onboarding";

type FormState = {
  firmName: string;
  auditorName: string;
  email: string;
  asicNumber: string;
};

const initialForm: FormState = {
  firmName: "",
  auditorName: "",
  email: "",
  asicNumber: "",
};

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [asicState, setAsicState] = useState<CheckState>("idle");
  const [asicMessage, setAsicMessage] = useState(
    "Enter the 9-digit number from your SMSF auditor registration.",
  );
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const digits = formatAsicNumber(form.asicNumber);

    if (!digits) {
      const result = checkAsicAuditorNumber(digits);
      setAsicState(result.state);
      setAsicMessage(result.message);
      return;
    }

    setAsicState("checking");
    setAsicMessage("Checking ASIC register...");

    const timer = window.setTimeout(() => {
      const result = checkAsicAuditorNumber(digits);
      setAsicState(result.state);
      setAsicMessage(result.message);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [form.asicNumber]);

  const emailIsValid = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const canContinue =
    form.firmName.trim().length > 1 &&
    form.auditorName.trim().length > 1 &&
    emailIsValid &&
    asicState === "valid";

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "asicNumber" ? formatAsicNumber(value) : value,
    }));
    setSaveMessage("");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue) {
      setSaveMessage("Complete the highlighted fields, then continue.");
      return;
    }

    saveProfile({
      firmName: form.firmName.trim(),
      auditorName: form.auditorName.trim(),
      email: form.email.trim(),
      asicNumber: formatAsicNumber(form.asicNumber),
    });
    setSaveMessage("Auditor details saved. Opening your first fund screen.");
    router.push("/onboarding/welcome");
  }

  return (
    <form className="max-w-3xl" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="field-label">Firm name</span>
          <input
            className="input"
            name="firmName"
            autoComplete="organization"
            value={form.firmName}
            onChange={(event) => updateField("firmName", event.target.value)}
            required
            aria-describedby="firm-help"
          />
          <span className="field-hint" id="firm-help">
            Use the name clients see on your audit report.
          </span>
        </label>

        <label className="space-y-2">
          <span className="field-label">Your name</span>
          <input
            className="input"
            name="auditorName"
            autoComplete="name"
            value={form.auditorName}
            onChange={(event) => updateField("auditorName", event.target.value)}
            required
            aria-describedby="name-help"
          />
          <span className="field-hint" id="name-help">
            This appears on signed reports.
          </span>
        </label>

        <label className="space-y-2">
          <span className="field-label">Email</span>
          <input
            className="input"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            aria-describedby="email-help"
          />
          <span className="field-hint" id="email-help">
            We use this for sign-in and audit receipts.
          </span>
        </label>

        <label className="space-y-2">
          <span className="field-label">ASIC auditor number</span>
          <input
            className="input"
            name="asicNumber"
            inputMode="numeric"
            autoComplete="off"
            value={form.asicNumber}
            onChange={(event) => updateField("asicNumber", event.target.value)}
            required
            aria-describedby="asic-status"
          />
          <span
            className={`block text-sm leading-6 ${
              asicState === "valid"
                ? "text-[var(--success)]"
                : asicState === "invalid"
                  ? "text-[var(--danger)]"
                  : "text-[var(--muted)]"
            }`}
            id="asic-status"
            aria-live="polite"
          >
            {asicState === "valid" ? "ASIC verified. " : null}
            {asicMessage}
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="primary-button w-full sm:w-auto" type="submit" disabled={!canContinue}>
          Create firm workspace
        </button>
        <p className="text-sm leading-6 text-[var(--muted)]" aria-live="polite">
          {saveMessage || "No card required. Auto is optional and costs $49 per audit when activated."}
        </p>
      </div>
    </form>
  );
}
