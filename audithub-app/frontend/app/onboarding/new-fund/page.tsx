import { FundForm } from "@/components/onboarding/FundForm";
import { OnboardingFrame } from "@/components/onboarding/OnboardingFrame";

export default function NewFundPage() {
  return (
    <OnboardingFrame
      step={3}
      eyebrow="First audit"
      title="Create the audit from one fund record."
      description="Add only what is needed to open the working surface. You can invite the accountant, upload evidence, and activate Auto after the audit opens."
    >
      <FundForm />
    </OnboardingFrame>
  );
}
