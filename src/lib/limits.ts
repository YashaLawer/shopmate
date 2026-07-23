// Message top-up pack (one-time add-on purchased on top of the monthly plan).
export const TOPUP = {
  messages: 1000,
  priceCents: 900, // $9.00
  label: "1,000 extra messages",
};

// Current UTC month as 'YYYY-MM'. Top-up credits are scoped to the month bought.
export function currentPeriod(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Extra messages currently active (only count if bought this month).
export function activeTopup(profile: {
  topup_messages?: number | null;
  topup_period?: string | null;
}): number {
  return profile.topup_period === currentPeriod()
    ? (profile.topup_messages ?? 0)
    : 0;
}
