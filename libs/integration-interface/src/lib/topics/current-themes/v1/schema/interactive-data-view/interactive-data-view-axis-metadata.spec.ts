import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const IDV = 'v2.usages.interactiveDataView'

// The interactive data view's root is a flat structural container (border/background/color/gap/
// paddingX/paddingY) with no variant/state/severity wrapper, so it opens no scope; its settings
// block is behavioral options (axis: 'setting') and filterView/dataListGridSorting are static
// token groups. The usage's only axis is the nested sorting button: a state slot
// (defaultState/hover/focus) that re-roots as a child component. Each non-default state falls
// back to defaultState on its own level; the fully-default button (and the static root, settings,
// and filterView tokens) carry no fallback. Fallback paths are relative to IDV.
describe('interactiveDataView axis metadata', () => {
  const scopes = collectAxisScopes(IDV)

  // The sorting button sits under the `dataListGridSorting.button` key, so its scope path ends in
  // `button` (the walker keys scopes by structural path, not the shape's registered id).
  it('opens a scope only for the sorting button (the structural root opens none)', () => {
    const names = new Set([...scopes.keys()].map((p) => p.split('.').pop()))
    expect([...names].sort()).toEqual(['button'])
  })

  describe('button (the dataListGridSorting sorting button)', () => {
    it('has its states (per-state content unmarked)', () => {
      expectAxes(scopes, 'button', { state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(IDV, {
        from: 'dataListGridSorting.button.hover.icon.color',
        to: 'dataListGridSorting.button.defaultState.icon.color',
      })
    })

    it('focus falls back to defaultState', () => {
      expectFallback(IDV, {
        from: 'dataListGridSorting.button.focus.border.color',
        to: 'dataListGridSorting.button.defaultState.border.color',
      })
    })

    it('defaultState has no fallback (root opens no scope)', () => {
      expectFallback(IDV, { from: 'dataListGridSorting.button.defaultState.icon.color', to: undefined })
    })
  })

  describe('root', () => {
    it('a static root token has no fallback (no enclosing scope)', () => {
      expectFallback(IDV, { from: 'background', to: undefined })
    })

    it('a settings option (axis: setting) has no fallback', () => {
      expectFallback(IDV, { from: 'settings.sortDirection', to: undefined })
    })

    it('a static filterView token has no fallback', () => {
      expectFallback(IDV, { from: 'filterView.background', to: undefined })
    })

    it('a static sorting-group token has no fallback', () => {
      expectFallback(IDV, { from: 'dataListGridSorting.background', to: undefined })
    })
  })
})
