"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Shared wrapper                                                            */
/* -------------------------------------------------------------------------- */

function EmptyWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  NoAudits                                                                  */
/* -------------------------------------------------------------------------- */

interface NoAuditsProps {
  onCreateAudit?: () => void;
  className?: string;
}

export function NoAudits({ onCreateAudit, className }: NoAuditsProps) {
  return (
    <EmptyWrapper className={className}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <rect
          x="18"
          y="10"
          width="44"
          height="56"
          rx="4"
          stroke="#C8553D"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M28 26h24M28 34h18M28 42h20"
          stroke="#B8924C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="28"
          y="50"
          width="8"
          height="8"
          rx="2"
          stroke="#4F7A52"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M30 54l2 2 4-4"
          stroke="#4F7A52"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="font-serif text-xl font-semibold text-ink mb-2">
        Start your first audit
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Create an audit to begin reviewing an SMSF. You can import fund details
        or start from scratch.
      </p>
      <Button size="lg" onClick={onCreateAudit}>
        Create audit
      </Button>
    </EmptyWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/*  NoDocuments                                                               */
/* -------------------------------------------------------------------------- */

interface NoDocumentsProps {
  onBrowse?: () => void;
  className?: string;
}

export function NoDocuments({ onBrowse, className }: NoDocumentsProps) {
  return (
    <EmptyWrapper className={className}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <rect
          x="16"
          y="24"
          width="48"
          height="40"
          rx="4"
          stroke="#B8924C"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 3"
        />
        <path
          d="M40 34v16M32 42h16"
          stroke="#C8553D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M34 18l6-6 6 6"
          stroke="#B8924C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 12v16"
          stroke="#B8924C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="font-serif text-xl font-semibold text-ink mb-2">
        Drop the supporting documents here, or browse
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Upload trust deeds, financial statements, bank statements and other
        supporting documents for this audit.
      </p>
      <Button variant="secondary" onClick={onBrowse}>
        Browse files
      </Button>
    </EmptyWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/*  NoQueries                                                                 */
/* -------------------------------------------------------------------------- */

interface NoQueriesProps {
  className?: string;
}

export function NoQueries({ className }: NoQueriesProps) {
  return (
    <EmptyWrapper className={className}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r="24"
          stroke="#4F7A52"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M30 40l6 6 14-14"
          stroke="#4F7A52"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="font-serif text-xl font-semibold text-ink mb-2">
        No open queries
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Good place to be. All queries have been resolved or no queries have been
        raised for this audit.
      </p>
    </EmptyWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/*  AutoOff                                                                   */
/* -------------------------------------------------------------------------- */

interface AutoOffProps {
  onActivate?: () => void;
  className?: string;
}

export function AutoOff({ onActivate, className }: AutoOffProps) {
  return (
    <EmptyWrapper className={className}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <path
          d="M40 16l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10l3-10z"
          stroke="#B8924C"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M24 52c0-4 4-8 16-8s16 4 16 8"
          stroke="#B8924C"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="30"
          cy="58"
          r="2"
          fill="#B8924C"
        />
        <circle
          cx="40"
          cy="60"
          r="2"
          fill="#B8924C"
        />
        <circle
          cx="50"
          cy="58"
          r="2"
          fill="#B8924C"
        />
      </svg>
      <h3 className="font-serif text-xl font-semibold text-ink mb-2">
        Auto is not active
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Auto would review your documents and advance checklist items
        automatically, saving you time on routine checks.
      </p>
      <Button variant="gold" onClick={onActivate}>
        Activate Auto
      </Button>
    </EmptyWrapper>
  );
}
