import { collectAxisScopes } from './test-utils'
import { resolveLeafFallback, THEME_VAR_PREFIX } from '../utils/resolve-leaf-fallback'

const U = 'v2.usages.menubar'
const leaf = (p: string) => THEME_VAR_PREFIX + `${U}.${p}`.slice('v2.'.length).replace(/\./g, '-')
const show = (p: string) => {
  const r = resolveLeafFallback(leaf(p))
  console.log('FB', p, '->', r ? r.slice(THEME_VAR_PREFIX.length) : undefined)
}

describe('menubar axis probe', () => {
  it('dumps primitives scopes', () => {
    const scopes = collectAxisScopes('v2.primitives')
    console.log('PRIMS', scopes.size)
    for (const [s, a] of scopes) console.log(s, JSON.stringify(a))
    expect(true).toBe(true)
  })
  it('dumps scopes', () => {
    const scopes = collectAxisScopes(U)
    console.log('SIZE', scopes.size)
    for (const [s, a] of scopes) console.log(s, JSON.stringify(a))
    expect(true).toBe(true)
  })
  it('dumps fallbacks', () => {
    show('defaultVariant.defaultState.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.focus.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.active.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.active.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.focus.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.state.hover.defaultSeverity.color')
    show('defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.color')
    expect(true).toBe(true)
  })
})
