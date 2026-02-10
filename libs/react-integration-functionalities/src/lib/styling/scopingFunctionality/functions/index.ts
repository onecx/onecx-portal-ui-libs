/**
 * Normalizes CSS for hashing by removing comments and extra whitespace.
 *
 * @param css - Raw CSS string.
 * @param normalize - Whether to normalize before hashing.
 * @returns Normalized CSS string.
 */
export function normalizeForHash(css: string, normalize: boolean): string {
  if (!normalize) return css
  return css
    .replace(/\/\*[^]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Computes a stable hash for a string.
 *
 * @param s - Input string.
 * @returns Hash string.
 */
export function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(36)
}

/**
 * Checks if an element is a PrimeReact style tag.
 *
 * @param el - Element to inspect.
 * @returns True if the element is a PrimeReact style tag.
 */
export function isPrimeReactStyle(el: Element): boolean {
  return (
    el.tagName === 'STYLE' &&
    !el.hasAttribute('data-app-primereact-style') &&
    (el.hasAttribute('data-primereact-style-id') || el.id?.startsWith('primereact_'))
  )
}

/**
 * Extracts a PrimeReact style element from a node.
 *
 * @param n - Node to inspect.
 * @returns PrimeReact style element or null.
 */
export function getStyleFromNode(n: Node): HTMLStyleElement | null {
  if (n.nodeType === Node.ELEMENT_NODE && isPrimeReactStyle(n as Element)) return n as HTMLStyleElement
  if (n.nodeType === Node.TEXT_NODE) {
    const p = n.parentNode as Element | null
    if (p && isPrimeReactStyle(p)) return p as HTMLStyleElement
  }
  return null
}

/**
 * Determines if a style block should be included based on prefixes/allowlist.
 *
 * @param styleId - Style identifier.
 * @param css - Raw CSS string.
 * @param alwaysIncludeStyleIds - Style ids to always include.
 * @param prefixFilter - Optional CSS variable prefix filter.
 * @returns True if the style should be included.
 */
export function shouldInclude(
  styleId: string,
  css: string,
  alwaysIncludeStyleIds: string[],
  prefixFilter?: string
): boolean {
  if (alwaysIncludeStyleIds.includes(styleId)) return true
  if (!prefixFilter) return true
  return css.includes(`--${prefixFilter}-`)
}

/**
 * Wraps CSS in an @scope block for the given root/limit selectors.
 *
 * @param css - Raw CSS string.
 * @param scopeRootSelector - Root selector for scoping.
 * @param scopeLimitSelector - Optional limit selector for scoping.
 * @returns Scoped CSS string.
 */
export function scopeCss(css: string, scopeRootSelector: string, scopeLimitSelector?: string): string {
  const prelude = scopeLimitSelector
    ? `@scope(${scopeRootSelector}) to (${scopeLimitSelector})`
    : `@scope(${scopeRootSelector})`
  const body = css.replace(/:root\b/g, ':scope')
  return `${prelude}{\n${body}\n}\n`
}
