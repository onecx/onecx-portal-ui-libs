import { collectAxisScopes } from './test-utils'

const MENU = 'v2.usages.menu'

// The menu is a static container: its root and the `item`/`submenuLabel`/`submenuIconButton`/
// `separator` sub-groups expose no `defaultVariant`/`defaultState`/`defaultSeverity` keys of their
// own — their tokens are flat `{{primitives.*}}` references (item's `focus`/`hover` are plain named
// sub-groups, not members of a state axis). It therefore carries no relaxed-axis fallback. The
// correct result is zero fallback scopes.
describe('menu axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(MENU).size).toBe(0)
  })
})
