import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditHub — SMSF Audit Platform",
  description: "The complete audit platform built for Australian SMSF auditors. Dynamic checklist, document management, AI-assisted auditing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
