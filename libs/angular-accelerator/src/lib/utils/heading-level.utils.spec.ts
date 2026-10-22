import { normalizeHeadingLevel } from './heading-level.utils'

describe('normalizeHeadingLevel', () => {
  it('should keep valid levels', () => {
    expect(normalizeHeadingLevel(1)).toBe(1)
    expect(normalizeHeadingLevel(6)).toBe(6)
  })
  it('should clamp out-of-range levels', () => {
    expect(normalizeHeadingLevel(0)).toBe(1)
    expect(normalizeHeadingLevel(9)).toBe(6)
  })
  it('should fall back for missing or non-numeric values', () => {
    expect(normalizeHeadingLevel(undefined)).toBe(2)
    expect(normalizeHeadingLevel(null)).toBe(2)
    expect(normalizeHeadingLevel(NaN)).toBe(2)
    expect(normalizeHeadingLevel(undefined, 3)).toBe(3)
  })
})
