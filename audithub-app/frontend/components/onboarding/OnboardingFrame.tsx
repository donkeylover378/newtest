import Link from "next/link";

type OnboardingFrameProps = {
  step: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  asideTitle?: string;
  asideBody?: string;
};

const steps = ["Auditor details", "First fund", "Start audit"];

export function OnboardingFrame({
  step,
  eyebrow,
  title,
  description,
  children,
  asideTitle = "No setup fees today",
  asideBody = "Creating your firm workspace and first audit is free. Auto costs $49 only if you choose to activate it inside an audit.",
}: OnboardingFrameProps) {
  return (
    <main className="page-shell flex items-center justify-center">
      <section className="grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="product-card rounded-[32px] p-5 sm:p-8 lg:p-10">
          <header className="mb-8">
            <Link
              className="mb-8 inline-flex text-sm font-black tracking-[-0.04em]"
              href="/onboarding/signup"
              aria-label="AuditHub home"
            >
              AuditHub
            </Link>

            <nav aria-label="Onboarding progress" className="mb-8">
              <ol className="grid gap-2 sm:grid-cols-3">
                {steps.map((label, index) => {
                  const currentStep = index + 1;
                  const isCurrent = currentStep === step;
                  const isDone = currentStep < step;

                  return (
                    <li
                      className={`rounded-2xl border px-3 py-2 text-xs font-bold ${
                        isCurrent
                          ? "border-[var(--accent-orange)] bg-[#fff4e8] text-[var(--ink)]"
                          : isDone
                            ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"
                            : "border-[var(--line)] bg-[#fffdf8] text-[var(--muted)]"
                      }`}
                      key={label}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      <span className="block text-[0.64rem] uppercase tracking-[0.16em]">
                        Step {currentStep}
                      </span>
                      {label}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-[var(--accent-orange)]">
              {eyebrow}
            </p>
            <h1 className="font-headline max-w-3xl text-4xl font-black leading-[0.95] text-[var(--ink)] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
              {description}
            </p>
          </header>

          {children}
        </div>

        <aside className="product-card h-fit rounded-[28px] p-5 sm:p-6">
          <div className="status-pill mb-4">Hosted in Sydney · AWS ap-southeast-2</div>
          <h2 className="font-headline text-3xl font-black leading-none">{asideTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{asideBody}</p>
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#fffdf8] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">
              First audit target
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              Sign up, add a fund, then land directly on the working surface. No walkthroughs, no
              support call, no surprise charge.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
