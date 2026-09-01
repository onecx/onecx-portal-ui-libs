import { theme } from '../current-themes.schema'
import { focusRingShape } from './primitives'

// Regression: the global focus-ring primitive maps to a single PrimeNG `semantic.focusRing`
// value, so `width`/`offset`/`shadow`/`radius` must accept plain CSS values (and refs to them),
// not only named-size objects. A literal like "2px" previously failed the `themeRef` regex and
// was rejected, breaking theme application for any theme that sets a concrete focus-ring size.
describe('focusRingShape', () => {
  it('accepts literal CSS values for width and offset', () => {
    const result = focusRingShape.safeParse({
      color: '#274B5F',
      width: '2px',
      style: 'solid',
      offset: '2px',
    })
    expect(result.success).toBe(true)
  })

  it('accepts theme refs for width and offset', () => {
    const result = focusRingShape.safeParse({
      width: '{{primitives.focusRing.width}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
      radius: '{{primitives.focusRing.radius}}',
    })
    expect(result.success).toBe(true)
  })

})

describe('theme (full properties payload)', () => {
  // Mirrors the shape of the wire mock: primitives.focusRing with concrete values plus
  // usages/regionOverrides. Ensures a realistic theme parses without a ZodError.
  it('parses a theme whose focusRing carries literal width/offset', () => {
    const themeJson = {
      v2: {
        primitives: {
          focusRing: {
            color: '#274B5F',
            width: '2px',
            style: 'solid',
            offset: '2px',
          },
        },
        usages: {
          button: {
            backgroundColor: 'hotpink',
            color: 'chartreuse',
          },
        },
        regionOverrides: {
          header: {
            primitives: {
              area: {
                canvas: {
                  bg: { color: '#0D3650' },
                  contrast: '#ffffff',
                  defaultState: { defaultVariant: { bg: { color: '#0D3650' }, contrast: '#ffffff' } },
                },
              },
            },
          },
        },
      },
    }
    const result = theme.safeParse(themeJson)
    expect(result.success).toBe(true)
  })
})
