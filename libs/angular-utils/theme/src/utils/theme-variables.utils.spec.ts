import { findOnexThemeVariables, hasValueInDom } from './theme-variables.utils'

describe('hasValueInDom', () => {
  it('returns true when the variable is set on the document root', () => {
    document.documentElement.style.setProperty('--onecx-theme-surface', 'rebeccapurple')
    expect(hasValueInDom('--onecx-theme-surface')).toBe(true)
  })

  it('returns false when the variable is not set on the document root', () => {
    expect(hasValueInDom('--onecx-theme-never-defined')).toBe(false)
  })

  it('returns true when the variable is set to a reference to another variable', () => {
    document.documentElement.style.setProperty('--onecx-theme-target', 'rgb(9, 8, 7)')
    document.documentElement.style.setProperty('--onecx-theme-alias', 'var(--onecx-theme-target)')
    expect(hasValueInDom('--onecx-theme-alias')).toBe(true)
  })

  it('returns true when the variable is set to a reference to another variable that does not exist', () => {
    document.documentElement.style.setProperty('--onecx-theme-alias', 'var(--onecx-theme-target)')
    expect(hasValueInDom('--onecx-theme-alias')).toBe(true)
  })

  it('checks the provided element instead of the root', () => {
    const element = document.createElement('div')
    element.style.setProperty('--onecx-theme-local', 'rgb(1, 2, 3)')
    expect(hasValueInDom('--onecx-theme-local', element)).toBe(true)
    expect(hasValueInDom('--onecx-theme-local')).toBe(false)
  })
})

describe('findOnexThemeVariables', () => {
  it('extracts each distinct variable in order of first appearance', () => {
    const css =
      'color: var(--onecx-theme-primary); background: var(--onecx-theme-input); border-color: var(--onecx-theme-primary);'
    expect(findOnexThemeVariables(css, () => true)).toEqual(['--onecx-theme-primary', '--onecx-theme-input'])
  })

  it('ignores variables that are not onecx-theme prefixed', () => {
    const css = 'color: var(--p-button-color); accent: var(--onecx-theme-accent);'
    expect(findOnexThemeVariables(css, () => true)).toEqual(['--onecx-theme-accent'])
  })

  it('ignores variable-like names outside a var() call', () => {
    const css = '--onecx-theme-loose: 1; color: red;'
    expect(findOnexThemeVariables(css, () => true)).toEqual([])
  })

  it('applies the supplied filter', () => {
    const css = 'color: var(--onecx-theme-a); background: var(--onecx-theme-b);'
    expect(findOnexThemeVariables(css, (name) => name === '--onecx-theme-b')).toEqual(['--onecx-theme-b'])
  })

  it('defaults to keeping only variables that have a value in the DOM', () => {
    document.documentElement.style.setProperty('--onecx-theme-present', 'hotpink')
    const css = 'color: var(--onecx-theme-present); background: var(--onecx-theme-absent);'
    expect(findOnexThemeVariables(css)).toEqual(['--onecx-theme-present'])
  })
})
