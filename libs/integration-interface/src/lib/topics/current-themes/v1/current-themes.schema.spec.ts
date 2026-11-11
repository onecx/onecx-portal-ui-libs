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
