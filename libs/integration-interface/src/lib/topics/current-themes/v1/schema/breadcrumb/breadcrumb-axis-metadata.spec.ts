import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const BREADCRUMB = 'v2.usages.breadcrumb'

describe('breadcrumb axis metadata', () => {
  const scopes = collectAxisScopes(BREADCRUMB)

  it('opens a scope only for the item child', () => {
    expect([...scopes.keys()]).toEqual([`${BREADCRUMB}.item`])
  })

  describe('item', () => {
    it('has its default variant, state and severity members', () => {
      expectAxes(scopes, 'item', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
        severity: ['defaultSeverity'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(BREADCRUMB, {
        from: 'item.defaultVariant.hover.defaultSeverity.background',
        to: 'item.defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultState has no fallback (item re-roots, no parent scope)', () => {
      expectFallback(BREADCRUMB, {
        from: 'item.defaultVariant.defaultState.defaultSeverity.background',
        to: undefined,
      })
    })
  })
})
