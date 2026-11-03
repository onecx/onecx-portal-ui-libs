import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'
import { deriveLeafAxisMetadata } from '../utils/axis-metadata'
import { theme } from '../current-themes.schema'

const INPUT = 'v2.usages.input'

// The input is checked for its axis metadata and for how the resolver uses it: a non-default key
// falls back to its default, and a fully-default leaf has no fallback (the input has no parent scope).
// Fallback paths are relative to INPUT.
describe('input axis metadata', () => {
  const scopes = collectAxisScopes(INPUT)

  it('opens a scope only for the input root', () => {
    expect([...scopes.keys()]).toEqual([INPUT])
  })

  describe('root', () => {
    it('has its variants, states and severity (token content unmarked)', () => {
      expectAxes(scopes, INPUT, {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
        severity: ['defaultSeverity'],
      })
    })

    it('filled + hover falls back to filled + defaultState', () => {
      expectFallback(INPUT, {
        from: 'filled.hover.defaultSeverity.background',
        to: 'filled.defaultState.defaultSeverity.background',
      })
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.background',
        to: 'defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(INPUT, {
        from: 'defaultVariant.hover.defaultSeverity.background',
        to: 'defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + defaultState has no fallback (no parent scope)', () => {
      expectFallback(INPUT, { from: 'defaultVariant.defaultState.defaultSeverity.background', to: undefined })
    })
  })

  // The named font/fontSize leaves introduced by the independent typography scale must still
  // resolve as plain leaves (no axis-metadata corruption) and expose their fallback paths.
  describe('named typography leaves (font.size / font.weight / sm.fontSize / lg.fontSize)', () => {
    it('resolves each named font leaf as a plain leaf (no corruption, no drop)', () => {
      for (const leaf of ['font.size', 'font.weight', 'sm.fontSize', 'lg.fontSize']) {
        const metadata = deriveLeafAxisMetadata(theme, `${INPUT}.defaultVariant.defaultState.defaultSeverity.${leaf}`)
        // A leaf that resolves (rather than returning undefined) with a single input-root scope
        // and exactly the expected relaxed-axis entries proves the named path is intact.
        expect(metadata).toEqual({
          scopes: [
            {
              scopePath: INPUT,
              entries: [
                { kind: 'severity', segments: ['defaultSeverity'] },
                { kind: 'state', segments: ['defaultState'] },
                { kind: 'variant', segments: ['defaultVariant'] },
              ],
            },
          ],
        })
      }
    })

    it('a filled font leaf falls back to the defaultVariant baseline font leaf', () => {
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.font.size',
        to: 'defaultVariant.defaultState.defaultSeverity.font.size',
      })
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.font.weight',
        to: 'defaultVariant.defaultState.defaultSeverity.font.weight',
      })
    })

    it('a baseline font leaf (defaultVariant + defaultState) has no fallback', () => {
      expectFallback(INPUT, {
        from: 'defaultVariant.defaultState.defaultSeverity.font.size',
        to: undefined,
      })
    })

    it('a filled named-size fontSize falls back to the defaultVariant named size', () => {
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.sm.fontSize',
        to: 'defaultVariant.defaultState.defaultSeverity.sm.fontSize',
      })
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.lg.fontSize',
        to: 'defaultVariant.defaultState.defaultSeverity.lg.fontSize',
      })
    })
  })
})
