export type DurationPreset = "3m" | "1h" | "1d" | "1w" | "1m" | "1y";

export const DURATION_PRESETS: {
  value: DurationPreset;
  label: string;
  seconds: number;
}[] = [
  { value: "3m", label: "3 minutes", seconds: 3 * 60 },
  { value: "1h", label: "1 hour", seconds: 60 * 60 },
  { value: "1d", label: "1 day", seconds: 24 * 60 * 60 },
  { value: "1w", label: "1 week", seconds: 7 * 24 * 60 * 60 },
  { value: "1m", label: "1 month", seconds: 30 * 24 * 60 * 60 },
  { value: "1y", label: "1 year", seconds: 365 * 24 * 60 * 60 },
];

export function addDuration(from: Date, preset: DurationPreset): Date {
  const p =
    DURATION_PRESETS.find((x) => x.value === preset) ??
    DURATION_PRESETS.find((x) => x.value === "1m")!;

  return new Date(from.getTime() + p.seconds * 1000);
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Closed";

  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);

  if (days > 1) return `Closes in ${days} days`;
  if (days === 1) return "Closes in 1 day";
  if (hrs > 1) return `Closes in ${hrs} hours`;
  if (hrs === 1) return "Closes in 1 hour";
  if (mins > 1) return `Closes in ${mins} minutes`;
  if (mins === 1) return "Closes in 1 minute";

  return "Closes soon";
}

export function getVoteStatus(now: Date, startsAt?: Date | null, expiresAt?: Date | null) {
  const startMs = startsAt?.getTime?.() ?? null;
  const endMs = expiresAt?.getTime?.() ?? null;
  const nowMs = now.getTime();

  if (startMs && nowMs < startMs) {
    return { phase: "scheduled" as const, label: "Scheduled", isOpen: false, isExpired: false };
  }

  if (endMs && nowMs >= endMs) {
    return { phase: "closed" as const, label: "Closed", isOpen: false, isExpired: true };
  }

  return { phase: "open" as const, label: "Open", isOpen: true, isExpired: false };
}
