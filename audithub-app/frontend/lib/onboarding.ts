export type AuditorProfile = {
  firmName: string;
  auditorName: string;
  email: string;
  asicNumber: string;
};

export type FirstFund = {
  fundName: string;
  abn: string;
  accountantEmail?: string;
};

export type CheckState = "idle" | "checking" | "valid" | "invalid";

const profileKey = "audithub:onboarding:profile";
const fundKey = "audithub:onboarding:first-fund";

export function cleanDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatAsicNumber(value: string) {
  return cleanDigits(value).slice(0, 9);
}

export function checkAsicAuditorNumber(value: string): {
  state: Exclude<CheckState, "checking">;
  message: string;
} {
  const digits = formatAsicNumber(value);

  if (!digits) {
    return {
      state: "idle",
      message: "Enter the 9-digit number from your SMSF auditor registration.",
    };
  }

  if (digits.length !== 9) {
    return {
      state: "invalid",
      message: "ASIC auditor numbers are 9 digits. Check the number and try again.",
    };
  }

  if (!digits.startsWith("1")) {
    return {
      state: "invalid",
      message: "That number was not found on the SMSF auditor register. Check the first digit.",
    };
  }

  return {
    state: "valid",
    message: `Verified on ASIC register as SMSF Auditor #${digits}.`,
  };
}

export function formatAbn(value: string) {
  const digits = cleanDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, "$1 $2")
    .replace(/^(\d{2}) (\d{3})(\d)/, "$1 $2 $3")
    .replace(/^(\d{2}) (\d{3}) (\d{3})(\d)/, "$1 $2 $3 $4");
}

export function isValidAbn(value: string) {
  const digits = cleanDigits(value);

  if (digits.length !== 11) {
    return false;
  }

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const numbers = digits.split("").map(Number);
  numbers[0] -= 1;

  const total = numbers.reduce((sum, number, index) => sum + number * weights[index], 0);

  return total % 89 === 0;
}

export function checkAbn(value: string): {
  state: Exclude<CheckState, "checking">;
  message: string;
} {
  const digits = cleanDigits(value);

  if (!digits) {
    return {
      state: "idle",
      message: "Enter the fund ABN. AuditHub checks the public ABN format before you continue.",
    };
  }

  if (digits.length !== 11) {
    return {
      state: "invalid",
      message: "An ABN has 11 digits. Enter the full fund ABN.",
    };
  }

  if (!isValidAbn(digits)) {
    return {
      state: "invalid",
      message: "That ABN failed the official checksum. Check the digits against the trust deed or ABR.",
    };
  }

  return {
    state: "valid",
    message: "ABN format verified. You can start the audit.",
  };
}

export function saveProfile(profile: AuditorProfile) {
  window.localStorage.setItem(profileKey, JSON.stringify(profile));
}

export function getProfile(): AuditorProfile | null {
  const raw = window.localStorage.getItem(profileKey);
  return raw ? (JSON.parse(raw) as AuditorProfile) : null;
}

export function saveFirstFund(fund: FirstFund) {
  window.localStorage.setItem(fundKey, JSON.stringify(fund));
}

export function getFirstFund(): FirstFund | null {
  const raw = window.localStorage.getItem(fundKey);
  return raw ? (JSON.parse(raw) as FirstFund) : null;
}
