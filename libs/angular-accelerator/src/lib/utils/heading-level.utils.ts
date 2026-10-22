/**
 * Clamps a heading level to the valid ARIA range of 1 to 6. Invalid values fall back to the given default.
 */
export function normalizeHeadingLevel(level: number | null | undefined, fallback = 2): number {
  const value = Math.trunc(Number(level))
  if (!Number.isFinite(value)) return fallback
  return Math.min(6, Math.max(1, value))
}
