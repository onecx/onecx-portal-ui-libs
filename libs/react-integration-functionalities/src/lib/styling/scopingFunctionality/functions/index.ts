/**
 * Normalizes CSS for hashing by removing comments and extra whitespace.
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
 */
export function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(36)
}

/**
 * Checks if an element is a PrimeReact style tag.
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
 */
export function scopeCss(css: string, scopeRootSelector: string, scopeLimitSelector?: string): string {
  const prelude = scopeLimitSelector
    ? `@scope(${scopeRootSelector}) to (${scopeLimitSelector})`
    : `@scope(${scopeRootSelector})`
  const body = css.replace(/:root\b/g, ':scope')
  return `${prelude}{\n${body}\n}\n`
}
