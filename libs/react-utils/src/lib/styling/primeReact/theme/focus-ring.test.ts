import { contrastRatio, MIN_RING_CONTRAST, parseColor, resolveFocusRingColor } from './focus-ring'

const WHITE = '#ffffff'
const BODY = '#f7f7f7'

function ratio(a: string, b: string) {
  return contrastRatio(parseColor(a)!, parseColor(b)!)
}

describe('resolveFocusRingColor', () => {
  it.each(['#550e0e33', '#274b5f', '#ad1457', '#ffeb3b', '#ffffff', 'rgb(255, 235, 59)', '#fc0'])(
    'returns an opaque colour with at least 3:1 against surface and body for primary %s',
    (primary) => {
      const ring = resolveFocusRingColor({ primaryColor: primary })
      expect(ring).toMatch(/^#[0-9a-f]{6}$/)
      expect(ratio(ring, WHITE)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
      expect(ratio(ring, BODY)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    }
  )

  it('keeps a primary colour that already has enough contrast', () => {
    expect(resolveFocusRingColor({ primaryColor: '#274b5f' })).toBe('#274b5f')
  })

  it('respects custom surface and body backgrounds', () => {
    const ring = resolveFocusRingColor({ primaryColor: '#808080', surfaceColor: '#222222', bodyBgColor: '#111111' })
    expect(ratio(ring, '#222222')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    expect(ratio(ring, '#111111')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
  })

  it('falls back to defaults for missing or unparsable colours', () => {
    for (const primaryColor of [undefined, null, '', 'var(--x)', 'red']) {
      const ring = resolveFocusRingColor({ primaryColor, surfaceColor: 'var(--y)' })
      expect(ratio(ring, WHITE)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    }
  })
})
