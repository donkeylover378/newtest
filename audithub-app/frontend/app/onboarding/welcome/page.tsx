import { OnboardingFrame } from "@/components/onboarding/OnboardingFrame";
import { WelcomeActions } from "@/components/onboarding/WelcomeActions";

export default function WelcomePage() {
  return (
    <OnboardingFrame
      step={2}
      eyebrow="Workspace created"
      title="Add your first fund."
      description="This is the only decision before the audit opens: add one fund now, import one CSV, or skip into a sample audit."
    >
      <WelcomeActions />
    </OnboardingFrame>
  );
}
