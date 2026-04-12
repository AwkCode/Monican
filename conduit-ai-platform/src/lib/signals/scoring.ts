import type { SignalType } from "./types";

const BASE_SCORES: Record<string, number> = {
  estate: 85,
  pre_foreclosure: 80,
  expired_listing: 75,
  fsbo: 70,
  high_turnover: 30,
  building_permit: 35,
};

const MILESTONE_SCORES: Record<number, number> = {
  5: 40,
  10: 50,
  15: 55,
  20: 60,
  25: 65,
};

/**
 * Calculate the base confidence score for a signal.
 */
export function calculateBaseScore(
  signalType: SignalType,
  detail?: Record<string, unknown>
): number {
  if (signalType === "ownership_milestone") {
    const years = (detail?.years_owned as number) ?? 10;
    // Find the closest milestone
    const milestones = Object.keys(MILESTONE_SCORES)
      .map(Number)
      .sort((a, b) => b - a);
    for (const m of milestones) {
      if (years >= m) return MILESTONE_SCORES[m];
    }
    return 35;
  }

  return BASE_SCORES[signalType] ?? 50;
}

/**
 * Apply recency adjustment to a score.
 */
export function applyRecencyAdjustment(
  score: number,
  signalDate: Date
): number {
  const daysOld = Math.floor(
    (Date.now() - signalDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let adjustment = 0;
  if (daysOld <= 7) adjustment = 5;
  else if (daysOld <= 30) adjustment = 0;
  else if (daysOld <= 90) adjustment = -5;
  else if (daysOld <= 180) adjustment = -10;
  else adjustment = -20;

  return clamp(score + adjustment, 0, 100);
}

/**
 * Apply correlation bonus when multiple signals exist for the same property.
 */
export function applyCorrelationBonus(
  score: number,
  relatedCount: number
): number {
  if (relatedCount >= 3) return clamp(score + 25, 0, 100);
  if (relatedCount >= 2) return clamp(score + 15, 0, 100);
  return score;
}

/**
 * Full scoring pipeline.
 */
export function computeFinalScore(
  signalType: SignalType,
  signalDate: Date,
  relatedCount: number,
  detail?: Record<string, unknown>
): number {
  let score = calculateBaseScore(signalType, detail);
  score = applyRecencyAdjustment(score, signalDate);
  score = applyCorrelationBonus(score, relatedCount);
  return score;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
