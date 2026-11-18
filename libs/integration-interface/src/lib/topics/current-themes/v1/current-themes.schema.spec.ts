import { themePropertiesV2 } from './current-themes.schema'

// A known-good minimal `primitives` payload (mirrors the wire-mock focus-ring shape), reused so a
// top-level theme document can be parsed without a full token tree.
const MINIMAL_PRIMITIVES = {
  focusRing: {
    color: '#274B5F',
    width: '2px',
    style: 'solid',
    offset: '2px',
  },
}

describe('themePropertiesV2.fallbackOrder', () => {
  it('defaults to [state, variant, severity] when omitted', () => {
    const parsed = themePropertiesV2.parse({ primitives: MINIMAL_PRIMITIVES })
    expect(parsed.fallbackOrder).toEqual(['state', 'variant', 'severity'])
  })

  it('preserves an explicit order', () => {
    const parsed = themePropertiesV2.parse({
      primitives: MINIMAL_PRIMITIVES,
      fallbackOrder: ['variant', 'severity', 'state'],
    })
    expect(parsed.fallbackOrder).toEqual(['variant', 'severity', 'state'])
  })

  it('still parses a theme document without the field (existing themes unchanged)', () => {
    const parsed = themePropertiesV2.parse({
      primitives: MINIMAL_PRIMITIVES,
      usages: {},
      regionOverrides: {},
    })
    expect(parsed.fallbackOrder).toEqual(['state', 'variant', 'severity'])
  })

  it('rejects an order containing an axis that is not relaxable', () => {
    // `parse`'s input type is broad here, so pass the invalid axis at runtime; the zod enum guard rejects it.
    const result = themePropertiesV2.safeParse({
      primitives: MINIMAL_PRIMITIVES,
      fallbackOrder: ['state', 'not-an-axis'],
    } as never)
    expect(result.success).toBe(false)
  })
})

describe('themePropertiesV2.primitives.font (global typography)', () => {
  it('parses all six properties as independent named scales plus scalar family/style', () => {
    const parsed = themePropertiesV2.parse({
      primitives: {
        font: {
          family: 'Inter',
          size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' },
          weight: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700' },
          lineHeight: { sm: '1.25', md: '1.5', lg: '1.75' },
          letterSpacing: { tight: '-0.01em', normal: '0', wide: '0.05em' },
          style: 'normal',
        },
      },
    })
    expect(parsed.primitives?.font).toEqual({
      family: 'Inter',
      size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' },
      weight: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700' },
      lineHeight: { sm: '1.25', md: '1.5', lg: '1.75' },
      letterSpacing: { tight: '-0.01em', normal: '0', wide: '0.05em' },
      style: 'normal',
    })
  })

  it('keeps a partially populated scale intact and does not synthesize omitted entries', () => {
    const parsed = themePropertiesV2.parse({
      primitives: { font: { family: 'Arial', size: { md: '12px' }, weight: { bold: '700' } } },
    })
    // Only the supplied entries exist — no invented `default`, no filling of `sm`/`lg` etc.
    expect(parsed.primitives?.font).toEqual({
      family: 'Arial',
      size: { md: '12px' },
      weight: { bold: '700' },
    })
  })

  it('preserves a legacy scalar font (scalar CSS strings, no scales)', () => {
    const parsed = themePropertiesV2.parse({
      primitives: {
        font: { family: 'Georgia', size: '16px', weight: '500', lineHeight: '1.4', letterSpacing: '0.01em', style: 'italic' },
      },
    })
    expect(parsed.primitives?.font).toEqual({
      family: 'Georgia',
      size: '16px',
      weight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.01em',
      style: 'italic',
    })
  })

  it('accepts a scale that is a single canonical entry (size only)', () => {
    const parsed = themePropertiesV2.parse({ primitives: { font: { size: { md: '1rem' } } } })
    expect(parsed.primitives?.font).toEqual({ size: { md: '1rem' } })
  })
})
