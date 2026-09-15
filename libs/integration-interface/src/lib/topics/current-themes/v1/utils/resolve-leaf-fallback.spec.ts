import { resolveLeafFallback } from './resolve-leaf-fallback'

// The resolver maps a theme variable name (a v2-root-relative, dash-encoded leaf path) to its
// nearest single-step fallback: the same variable with a single non-default axis reset to its
// default, picked in `fallbackOrder` order, re-emitted with the same variable-name encoding.
describe('resolveLeafFallback', () => {
  it('resolves the full-axis primitives leaf to its first step (default order)', () => {
    const varName = '--onecx-theme-primitives-variant-primary-state-hover-severity-success-border-color'
    expect(resolveLeafFallback(varName)).toBe(
      '--onecx-theme-primitives-variant-primary-defaultState-severity-success-border-color',
    )
  })

  it('reorders the relaxed axis when a custom fallback order is supplied', () => {
    const varName = '--onecx-theme-primitives-variant-primary-state-hover-severity-success-border-color'
    expect(resolveLeafFallback(varName, ['severity', 'variant', 'state'])).toBe(
      '--onecx-theme-primitives-variant-primary-state-hover-defaultSeverity-border-color',
    )
  })

  it('resolves a nested component leaf from the innermost scope, holding the outer scope', () => {
    // The calendar's own `defaultVariant` is at its default, so the innermost (input) scope
    // relaxes first — only its `state` moves, `filled` and the calendar scope stay put.
    const varName = '--onecx-theme-usages-calendar-defaultVariant-input-filled-hover-defaultSeverity-background-color'
    expect(resolveLeafFallback(varName)).toBe(
      '--onecx-theme-usages-calendar-defaultVariant-input-defaultState-defaultSeverity-background-color',
    )
  })

  it('omits an axis already at its default from the relaxed axis', () => {
    // `input`'s severity is fixed at `defaultSeverity`, so the first relaxable axis is `state`,
    // not `variant`.
    const varName = '--onecx-theme-usages-input-filled-hover-defaultSeverity-background-color'
    expect(resolveLeafFallback(varName)).toBe(
      '--onecx-theme-usages-input-filled-defaultState-defaultSeverity-background-color',
    )
  })

  it('returns undefined for a fully-default leaf (nothing to relax)', () => {
    expect(resolveLeafFallback('--onecx-theme-primitives-defaultVariant-defaultState-defaultSeverity-contrast')).toBeUndefined()
  })

  it('returns undefined for a variable name outside the theme prefix', () => {
    expect(resolveLeafFallback('var(--unrelated)')).toBeUndefined()
  })

  it('returns undefined for a leaf path that is not a known fallback leaf', () => {
    expect(resolveLeafFallback('--onecx-theme-primitives-does-not-exist-foo-bar')).toBeUndefined()
  })
})
