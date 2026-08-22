"use client";

import { ArrowLeft, Printer, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ReportPage() {
  const [lodged, setLodged] = useState(false);

  const audit = {
    fundName: "Acme Family Super Fund",
    fundAbn: "12 345 678 901",
    year: 2025,
    auditorName: "Sarah Mitchell",
    asicNumber: "12345678",
    firmName: "Mitchell Auditing Pty Ltd",
    firmAddress: "Level 4, 123 Collins Street\nMelbourne VIC 3000",
    signedAt: "15/09/2025 2:30 PM AEST",
    opinion: "unqualified",
    findingsCount: 1,
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Action Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-cream border-b border-[var(--border)] no-print">
        <Link href="/app" className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLodged(!lodged)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              lodged ? "bg-forest/10 text-forest border-forest/20" : "border-[var(--border)] hover:bg-cream"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {lodged ? "Lodged with ATO" : "Mark as lodged"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-cream transition-colors">
            <Send className="h-4 w-4" /> Send to trustees
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-terracotta text-white rounded-lg hover:bg-terracotta-dark transition-colors"
          >
            <Printer className="h-4 w-4" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-3xl mx-auto py-12 px-8">
        {/* Letterhead */}
        <div className="text-center mb-12 pb-8 border-b-2 border-ink">
          <h2 className="text-xl font-bold font-serif">{audit.firmName}</h2>
          <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-line mt-1">{audit.firmAddress}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">ASIC Registered SMSF Auditor No. {audit.asicNumber}</p>
        </div>

        {/* Audit Report */}
        <div className="space-y-8">
          <h1 className="text-2xl font-serif font-semibold text-center">Independent Auditor&apos;s Report</h1>

          <div className="space-y-2 text-sm">
            <p><strong>To the Trustees of</strong> {audit.fundName}</p>
            <p><strong>ABN:</strong> <span className="font-mono">{audit.fundAbn}</span></p>
            <p><strong>For the financial year ended</strong> 30 June {audit.year}</p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <h3 className="text-lg font-serif font-medium">Opinion</h3>
            <p>
              We have audited the financial report and compliance of {audit.fundName} (the &ldquo;Fund&rdquo;) for the year ended
              30 June {audit.year}, which comprises the statement of financial position as at 30 June {audit.year},
              the operating statement for the year then ended, and notes to the financial statements including a
              summary of significant accounting policies.
            </p>
            <p>
              In our opinion, the financial report of {audit.fundName} presents fairly, in all material respects,
              the financial position of the Fund as at 30 June {audit.year}, and its financial performance for the
              year then ended in accordance with Australian Accounting Standards.
            </p>

            <h3 className="text-lg font-serif font-medium mt-8">Basis for Opinion</h3>
            <p>
              We conducted our audit in accordance with Australian Auditing Standards. Our responsibilities under
              those standards are further described in the Auditor&apos;s Responsibilities section of our report.
              We are independent of the Fund in accordance with the ethical requirements of the Accounting
              Professional and Ethical Standards Board&apos;s APES 110 Code of Ethics for Professional Accountants.
            </p>

            <h3 className="text-lg font-serif font-medium mt-8">Trustee Responsibilities</h3>
            <p>
              The trustees of the Fund are responsible for the preparation and fair presentation of the financial
              report in accordance with Australian Accounting Standards and the Superannuation Industry
              (Supervision) Act 1993. This responsibility includes designing, implementing and maintaining internal
              controls relevant to the preparation and fair presentation of the financial report.
            </p>

            <h3 className="text-lg font-serif font-medium mt-8">Auditor&apos;s Responsibilities</h3>
            <p>
              Our objectives are to obtain reasonable assurance about whether the financial report as a whole is
              free from material misstatement, whether due to fraud or error, and to issue an auditor&apos;s report
              that includes our opinion. Reasonable assurance is a high level of assurance, but is not a guarantee
              that an audit conducted in accordance with Australian Auditing Standards will always detect a material
              misstatement when it exists.
            </p>

            {audit.findingsCount > 0 && (
              <>
                <h3 className="text-lg font-serif font-medium mt-8">Qualification</h3>
                <p>
                  During our audit, we identified a potential contravention of Section 66 of the SIS Act regarding
                  the acquisition of property at 42 Elm Street from a related party. The acquisition price of
                  $620,000 was below the independently assessed market value of $650,000. This matter has been
                  reported to the trustees and is included in the contravention report.
                </p>
              </>
            )}
          </div>

          {/* Sign Block */}
          <div className="mt-16 pt-8 border-t border-[var(--border)]">
            <div className="space-y-2">
              <p className="text-sm font-semibold">{audit.auditorName}</p>
              <p className="text-sm">Registered SMSF Auditor</p>
              <p className="text-sm font-mono text-[var(--muted-foreground)]">ASIC No. {audit.asicNumber}</p>
              <p className="text-sm">{audit.firmName}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-4">
                Signed electronically via AuditHub on {audit.signedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Management Letter */}
        <div className="mt-16 pt-8 border-t-2 border-ink">
          <h2 className="text-xl font-serif font-semibold text-center mb-8">Management Letter</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>Dear Trustees,</p>
            <p>
              In accordance with our engagement to audit the financial report and compliance of {audit.fundName} for
              the year ended 30 June {audit.year}, we wish to bring the following matters to your attention.
            </p>
            {audit.findingsCount > 0 ? (
              <div className="p-4 border border-amber/30 rounded-lg bg-amber/5 mt-4">
                <h4 className="font-medium text-amber-dark mb-2">Finding: Related party property acquisition (s66)</h4>
                <p>
                  The property at 42 Elm Street was acquired from Acme Holdings Pty Ltd, a related entity, at $620,000.
                  An independent valuation from Knight Frank dated 15 March 2025 assessed the market value at $650,000.
                  While the variance is $30,000 (4.6%), trustees should ensure all future related party transactions are
                  conducted at or above independently assessed market value to comply with Section 66 of the SIS Act.
                </p>
                <p className="mt-2 font-medium">
                  Recommendation: Obtain independent valuations prior to settlement for all related party transactions
                  and retain evidence of arm&apos;s length terms.
                </p>
              </div>
            ) : (
              <p>No material findings were identified during the audit. The Fund&apos;s financial statements and compliance
                with SIS requirements are in good order.</p>
            )}
            <p className="mt-4">
              We would like to take this opportunity to thank you for your cooperation during the audit process.
            </p>
            <p className="mt-4">Yours faithfully,</p>
            <p className="font-medium">{audit.auditorName}</p>
            <p>{audit.firmName}</p>
          </div>
        </div>

        {/* Contravention Report */}
        {audit.findingsCount > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-ink">
            <h2 className="text-xl font-serif font-semibold text-center mb-8">Auditor Contravention Report</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                In accordance with Section 129 of the Superannuation Industry (Supervision) Act 1993, we report
                the following contravention identified during our audit of {audit.fundName} for the year ended
                30 June {audit.year}.
              </p>
              <table className="w-full border border-[var(--border)] rounded-lg overflow-hidden mt-4">
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 font-medium bg-[var(--muted)] w-1/3">Section contravened</td>
                    <td className="px-4 py-2">SIS Act Section 66 — Acquisition of assets from related parties</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 font-medium bg-[var(--muted)]">Nature of contravention</td>
                    <td className="px-4 py-2">Acquisition of property from a related entity at below independently assessed market value</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 font-medium bg-[var(--muted)]">Details</td>
                    <td className="px-4 py-2">Property at 42 Elm Street acquired from Acme Holdings Pty Ltd for $620,000. Independent valuation: $650,000.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[var(--muted)]">Severity</td>
                    <td className="px-4 py-2">Non-material. Variance of $30,000 (4.6% of market value).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
