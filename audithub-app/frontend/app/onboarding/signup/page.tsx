import { OnboardingFrame } from "@/components/onboarding/OnboardingFrame";
import { SignupForm } from "@/components/onboarding/SignupForm";

export default function SignupPage() {
  return (
    <OnboardingFrame
      step={1}
      eyebrow="Start in under 3 minutes"
      title="Create your AuditHub workspace."
      description="Enter the audit details ASIC already knows. We verify your auditor number here so the first signed report is ready when you are."
    >
      <SignupForm />
    </OnboardingFrame>
  );
}
