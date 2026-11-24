import { contrastRatio, findAccessibleColor, MIN_RING_CONTRAST, parseColor, resolveFocusRingColor } from './focus-ring'

const WHITE = '#ffffff'
const BODY = '#f7f7f7'

function rgb(color: string): [number, number, number] {
  const parsed = parseColor(color)
  if (!parsed) throw new Error(`Unparsable colour ${color}`)
  return parsed
}

function ratio(a: string, b: string) {
  return contrastRatio(rgb(a), rgb(b))
}

function ring(primaryColor: string, surfaceColor: string, bodyBgColor?: string): string {
  const result = resolveFocusRingColor({ primaryColor, surfaceColor, bodyBgColor })
  if (!result) throw new Error('Expected a focus ring colour')
  return result
}

describe('resolveFocusRingColor', () => {
  it.each(['#550e0e33', '#274b5f', '#ad1457', '#ffeb3b', '#ffffff', 'rgb(255, 235, 59)', '#fc0'])(
    'returns an opaque colour with at least 3:1 against surface and body for primary %s',
    (primary) => {
      const result = ring(primary, WHITE, BODY)
      expect(result).toMatch(/^#[0-9a-f]{6}$/)
      expect(ratio(result, WHITE)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
      expect(ratio(result, BODY)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    }
  )

  it('keeps a primary colour that already has enough contrast', () => {
    expect(resolveFocusRingColor({ primaryColor: '#274b5f', surfaceColor: WHITE })).toBe('#274b5f')
  })

  it('lightens the primary colour on dark backgrounds', () => {
    const result = ring('#808080', '#222222', '#111111')
    expect(ratio(result, '#222222')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
    expect(ratio(result, '#111111')).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
  })

  it('uses the resolvable background only', () => {
    const result = ring('#ffeb3b', 'var(--y)', BODY)
    expect(ratio(result, BODY)).toBeGreaterThanOrEqual(MIN_RING_CONTRAST)
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
