import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const USAGE = 'v2.usages.dataTable'

// The data-table root is a pure aggregator (no variant/state/severity of its own), so it opens no
// fallback scope. Each stateful subcomponent re-roots as a child scope: the `cell` (shared by
// header/row/footer), the body `row`, its `odd`/`even` alternation, and the header `sortIcons` /
// `filterIcons` trees. `header` and `footer` are stateless boxes and open none; `base` /
// `columnTitle` / `settings` are static. A non-default key falls back to its default on its own
// scope, and a fully-default leaf has no fallback (its parent boxes are stateless). Fallback paths
// are relative to USAGE.
describe('data-table axis metadata', () => {
  const scopes = collectAxisScopes(USAGE)

  it('opens scopes only for the stateful subcomponents', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['cell', 'even', 'filterIcons', 'odd', 'row', 'sortIcons'])
  })

  describe('root', () => {
    it('opens no root scope (pure aggregator)', () => {
      expect([...scopes.keys()]).not.toContain(USAGE)
    })

    it('a static settings leaf has no fallback', () => {
      expectFallback(USAGE, { from: 'settings.checkboxColumnPosition', to: undefined })
    })

    it('a static base leaf has no fallback', () => {
      expectFallback(USAGE, { from: 'base.background', to: undefined })
    })

    it('a static columnTitle leaf has no fallback', () => {
      expectFallback(USAGE, { from: 'columnTitle.font.weight', to: undefined })
    })
  })

  describe('cell (shared by header/row/footer)', () => {
    it('has its states (no severity wrapper)', () => {
      expectAxes(scopes, 'cell', { state: ['defaultState', 'hover', 'active', 'selected', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(USAGE, { from: 'row.cell.hover.color', to: 'row.cell.defaultState.color' })
    })

    it('selected falls back to defaultState', () => {
      expectFallback(USAGE, { from: 'row.cell.selected.color', to: 'row.cell.defaultState.color' })
    })

    it('defaultState has no fallback (the enclosing boxes are stateless)', () => {
      expectFallback(USAGE, { from: 'row.cell.defaultState.color', to: undefined })
    })
  })

  describe('row', () => {
    it('has its states (focusRing opted out; cell/odd/even re-root as children)', () => {
      expectAxes(scopes, 'row', { state: ['defaultState', 'hover', 'active', 'selected'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(USAGE, { from: 'row.hover.color', to: 'row.defaultState.color' })
    })

    it('selected falls back to defaultState', () => {
      expectFallback(USAGE, { from: 'row.selected.color', to: 'row.defaultState.color' })
    })

    it('defaultState has no fallback (no parent scope)', () => {
      expectFallback(USAGE, { from: 'row.defaultState.color', to: undefined })
    })
  })

  describe('alternating rows (odd/even)', () => {
    it('have their states', () => {
      expectAxes(scopes, 'odd', { state: ['defaultState', 'hover', 'active', 'selected'] })
      expectAxes(scopes, 'even', { state: ['defaultState', 'hover', 'active', 'selected'] })
    })

    it('odd hover falls back to odd defaultState', () => {
      expectFallback(USAGE, { from: 'row.odd.hover.color', to: 'row.odd.defaultState.color' })
    })

    it('even selected falls back to even defaultState', () => {
      expectFallback(USAGE, { from: 'row.even.selected.color', to: 'row.even.defaultState.color' })
    })

    it('odd defaultState has no fallback (the row is its stateless parent)', () => {
      expectFallback(USAGE, { from: 'row.odd.defaultState.color', to: undefined })
    })
  })

  describe('header icon trees (sortIcons/filterIcons)', () => {
    it('have their states (no selected)', () => {
      expectAxes(scopes, 'sortIcons', { state: ['defaultState', 'hover', 'active', 'focus'] })
      expectAxes(scopes, 'filterIcons', { state: ['defaultState', 'hover', 'active', 'focus'] })
    })

    it('sortIcons hover falls back to defaultState', () => {
      expectFallback(USAGE, {
        from: 'header.sortIcons.hover.icon.color',
        to: 'header.sortIcons.defaultState.icon.color',
      })
    })

    it('filterIcons active falls back to defaultState', () => {
      expectFallback(USAGE, {
        from: 'header.filterIcons.active.icon.color',
        to: 'header.filterIcons.defaultState.icon.color',
      })
    })

    it('sortIcons defaultState has no fallback (the header is stateless)', () => {
      expectFallback(USAGE, {
        from: 'header.sortIcons.defaultState.icon.color',
        to: undefined,
      })
    })
  })
})
