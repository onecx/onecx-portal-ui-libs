/** A predicate deciding whether an extracted `--onecx-theme-*` variable name is kept. */
export type ThemeVariableFilter = (varName: string) => boolean

/** Matches `var(--onecx-theme-*)` references; the capture group is the variable name. */
const THEME_VARIABLE_MATCHER = /var\(\s*(--onecx-theme-[\w-]+)/g

/**
 * Finds every OneCX theme variable referenced in a CSS string.
 *
 * Returns the distinct `--onecx-theme-*` custom property names, in order of first appearance.
 *
 * @param css - The CSS text to search (declarations, a `<style>` body, a stylesheet, …).
 * @param filter - A variable name is kept when this returns `true`. Defaults to
 *   {@link hasValueInDom}, i.e. only variables that resolve to a value.
 *
 * @example
 * findOnexThemeVariables('color: var(--onecx-theme-primary); background: var(--onecx-theme-input);')
 * // ['--onecx-theme-primary', '--onecx-theme-input']
 */
export function findOnexThemeVariables(css: string, filter: ThemeVariableFilter = hasValueInDom): string[] {
  const found = new Set<string>()
  for (const match of css.matchAll(THEME_VARIABLE_MATCHER)) {
    const varName = match[1]
    if (filter(varName)) {
      found.add(varName)
    }
  }
  return [...found]
}

/**
 * Checks whether an OneCX theme variable resolves to a value on an element.
 *
 * Theme variables are set on the document root (see the Shell `ThemeApplyService`), so the check
 * reads `getComputedStyle` of `document.documentElement` by default. This is the default
 * {@link ThemeVariableFilter} for {@link findOnexThemeVariables}.
 *
 * @param varName - The full custom property name, e.g. `--onecx-theme-primitives-primary`.
 * @param element - The element whose computed styles are read. Defaults to the document root.
 */
export function hasValueInDom(varName: string, element: Element = document.documentElement): boolean {
  return getComputedStyle(element).getPropertyValue(varName).trim() !== ''
}
