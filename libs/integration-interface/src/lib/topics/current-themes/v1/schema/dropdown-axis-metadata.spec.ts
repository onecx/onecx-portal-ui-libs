import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const DROPDOWN = 'v2.usages.dropdown'

// The dropdown's root has no axis of its own (its keys are component/settings groups, not variant
// members — the variants live only inside `container`), so it opens no scope. The three components
// that carry relaxed axes — `container` (variant + state), `clear` and `option` (state, each
// re-rooting as a child) — open independent sibling scopes with no shared parent scope. `settings`
// (axis: 'setting') and `option.group` (axis: 'none') opt out. Each component is checked for its
// axis metadata and for how the resolver uses it: a non-default key falls back to its default on the
// component's own level, and a fully-default component has no fallback (there is no parent scope).
// Fallback paths are relative to DROPDOWN.
describe('dropdown axis metadata', () => {
  const scopes = collectAxisScopes(DROPDOWN)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['clear', 'container', 'option'])
  })

  describe('container', () => {
    it('has its variants and states (per-state token content unmarked)', () => {
      expectAxes(scopes, 'container', {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
      })
    })

    it('filled + hover falls back to filled + defaultState', () => {
      expectFallback(DROPDOWN, {
        from: 'container.filled.hover.background',
        to: 'container.filled.defaultState.background',
      })
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(DROPDOWN, {
        from: 'container.filled.defaultState.background',
        to: 'container.defaultVariant.defaultState.background',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(DROPDOWN, {
        from: 'container.defaultVariant.hover.background',
        to: 'container.defaultVariant.defaultState.background',
      })
    })

    it('defaultVariant + defaultState has no fallback (no parent scope)', () => {
      expectFallback(DROPDOWN, { from: 'container.defaultVariant.defaultState.background', to: undefined })
    })
  })

  describe('clear', () => {
    it('has its states', () => {
      expectAxes(scopes, 'clear', { state: ['defaultState', 'hover', 'focus', 'disabled'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(DROPDOWN, { from: 'clear.hover.color', to: 'clear.defaultState.color' })
    })

    it('defaultState has no fallback (no parent scope)', () => {
      expectFallback(DROPDOWN, { from: 'clear.defaultState.color', to: undefined })
    })
  })

  describe('option', () => {
    it('has its states (group opted out)', () => {
      expectAxes(scopes, 'option', { state: ['defaultState', 'hover', 'focus', 'selected', 'disabled'] })
    })

    it('selected falls back to defaultState', () => {
      expectFallback(DROPDOWN, { from: 'option.selected.color', to: 'option.defaultState.color' })
    })

    it('defaultState has no fallback (no parent scope)', () => {
      expectFallback(DROPDOWN, { from: 'option.defaultState.color', to: undefined })
    })

    it('group (axis: none) has no fallback', () => {
      expectFallback(DROPDOWN, { from: 'option.group.color', to: undefined })
    })
  })
})
