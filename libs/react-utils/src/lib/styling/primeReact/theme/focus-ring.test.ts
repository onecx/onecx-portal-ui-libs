import { contrastRatio, findAccessibleColor, MIN_RING_CONTRAST, parseColor, resolveFocusRingColor } from './focus-ring'

const WHITE = '#ffffff'
const BODY = '#f7f7f7'

function ratio(a: string, b: string) {
  return contrastRatio(parseColor(a)!, parseColor(b)!)
}

describe('resolveFocusRingColor', () => {
  it.each(['#550e0e33', '#274b5f', '#ad1457', '#ffeb3b', '#ffffff', 'rgb(255, 235, 59)', '#fc0'])(
    'returns an opaque colour with at least 3:1 against surface and body for primary %s',
    (primary) => {
      const ring = resolveFocusRingColor({ primaryColor: primary, surfaceColor: WHITE, bodyBgColor: BODY })!
      expect(ring).toMatch(/^#[0-9a-f]{6}$/)
      expect(ratio(ring, WHITE)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
      expect(ratio(ring, BODY)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    }
  )

  it('keeps a primary colour that already has enough contrast', () => {
    expect(resolveFocusRingColor({ primaryColor: '#274b5f', surfaceColor: WHITE })).toBe('#274b5f')
  })

  it('lightens the primary colour on dark backgrounds', () => {
    const ring = resolveFocusRingColor({ primaryColor: '#808080', surfaceColor: '#222222', bodyBgColor: '#111111' })!
    expect(ratio(ring, '#222222')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    expect(ratio(ring, '#111111')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
  })

  it('uses the resolvable background only', () => {
    const ring = resolveFocusRingColor({ primaryColor: '#ffeb3b', surfaceColor: 'var(--y)', bodyBgColor: BODY })!
    expect(ratio(ring, BODY)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
  })

  it('returns undefined for missing or unparsable primary colours (no hardcoded default)', () => {
    for (const primaryColor of [undefined, null, '', 'var(--x)', 'red']) {
      expect(resolveFocusRingColor({ primaryColor, surfaceColor: WHITE })).toBeUndefined()
    }
  })

  it('returns undefined without a resolvable background', () => {
    expect(resolveFocusRingColor({ primaryColor: '#ffeb3b', surfaceColor: 'var(--y)' })).toBeUndefined()
  })
})

describe('findAccessibleColor', () => {
  it('returns the colour with the highest contrast if the ratio is not reachable', () => {
    expect(findAccessibleColor([128, 128, 128], [[255, 255, 255]], 25)).toBe('#000000')
  })
})
