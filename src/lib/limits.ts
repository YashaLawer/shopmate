// Message top-up packs (one-time add-ons purchased on top of the monthly plan).
export interface TopupPack {
  id: string;
  messages: number;
  priceCents: number;
}

export const TOPUPS: TopupPack[] = [
  { id: "s", messages: 1000, priceCents: 900 }, // $9   → $0.0090/msg
  { id: "m", messages: 5000, priceCents: 3900 }, // $39  → $0.0078/msg
  { id: "l", messages: 15000, priceCents: 9900 }, // $99 → $0.0066/msg
];

export function getTopup(id: string | null | undefined): TopupPack | undefined {
  return TOPUPS.find((t) => t.id === id);
}

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
