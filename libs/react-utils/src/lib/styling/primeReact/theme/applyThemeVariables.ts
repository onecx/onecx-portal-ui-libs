/**
 * Flattens a nested theme properties object into key-value pairs.
 */
const THEME_BLOCK_START = '/* app-theme-runtime:start */'
const THEME_BLOCK_END = '/* app-theme-runtime:end */'

/**
 * Normalizes a theme value into a string accepted by CSS custom properties.
 *
 * @param value - Raw theme value.
 * @returns Trimmed string representation, or undefined for unsupported values.
 */
function normalizeThemeValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim()

  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`
  }

  return undefined
}

/**
 * Converts camelCase or snake_case text into kebab-case.
 *
 * @param value - Source key to normalize.
 * @returns Kebab-cased key.
 */
function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase()
}

/**
 * Flattens nested theme groups into a single dictionary of normalized values.
 *
 * @param properties - Theme properties grouped by category.
 * @returns Flat key-value map of theme variables.
 */
function flattenThemeProperties(properties: Record<string, Record<string, unknown>>): Record<string, string> {
  const flattened: Record<string, string> = {}
  for (const category of Object.keys(properties)) {
    if (properties[category]) {
      for (const [key, value] of Object.entries(properties[category])) {
        const normalized = normalizeThemeValue(value)
        if (normalized) {
          flattened[key] = normalized
        }
      }
    }
  }
  return flattened
}

/**
 * Maps theme properties to CSS custom property names.
 */
function mapThemeToCSSVariables(themeProperties: Record<string, Record<string, unknown>>): Record<string, string> {
  const flattenedProperties = flattenThemeProperties(themeProperties)
  const cssVariables: Record<string, string> = {}

  for (const [key, value] of Object.entries(flattenedProperties)) {
    const normalizedKey = toKebabCase(key).replace(/^app-?/, '')
    const cssVarName = `--app-${normalizedKey}`
    cssVariables[cssVarName] = value
  }

  return cssVariables
}

/**
 * Applies CSS variables directly to scoped host elements.
 *
 * @param variables - CSS variables to apply.
 * @param candidateStyleIds - Candidate style ids used to locate scope roots.
 * @returns Nothing.
 */
function applyVariablesToScopeRoots(variables: Record<string, string>, candidateStyleIds: string[]): void {
  const roots: HTMLElement[] = []

  for (const candidateId of candidateStyleIds) {
    document
      .querySelectorAll(`[data-style-id="${candidateId}"], [data-intermediate-style-id="${candidateId}"]`)
      .forEach((el) => roots.push(el as HTMLElement))
  }

  roots.forEach((root) => {
    Object.entries(variables).forEach(([name, value]) => {
      root.style.setProperty(name, value)
    })
  })
}

/**
 * Creates root-level aliases for app-prefixed CSS variables.
 *
 * @param cssVariables - Variables prefixed with --app- keys.
 * @returns Variables with both app-prefixed and root aliases.
 */
function toRootVariables(cssVariables: Record<string, string>): Record<string, string> {
  const rootVariables: Record<string, string> = { ...cssVariables }

  Object.entries(cssVariables).forEach(([name, value]) => {
    if (!name.startsWith('--app-')) {
      return
    }

    const withoutAppPrefix = `--${name.slice('--app-'.length)}`
    if (!rootVariables[withoutAppPrefix]) {
      rootVariables[withoutAppPrefix] = value
    }
  })

  return rootVariables
}

/**
 * Computes style id candidates for scoped style lookup.
 *
 * @param styleId - Requested style id.
 * @returns Candidate ids including full and base variants.
 */
function getCandidateStyleIds(styleId: string): string[] {
  const baseId = styleId.includes('|') ? styleId.split('|')[0] : styleId
  return styleId === baseId ? [styleId] : [styleId, baseId]
}

/**
 * Finds scoped style elements matching candidate app style ids.
 *
 * @param candidateStyleIds - Candidate style ids for querying style tags.
 * @returns Matching scoped style elements.
 */
function queryScopedStyleElements(candidateStyleIds: string[]): HTMLElement[] {
  const scopedElements: HTMLElement[] = []

  for (const candidateId of candidateStyleIds) {
    document
      .querySelectorAll(`style[data-app-styles="${candidateId}"], style[data-app-primereact-style="${candidateId}"]`)
      .forEach((el) => scopedElements.push(el as HTMLElement))
  }

  return scopedElements
}

/**
 * Finds insertion point just after the first top-level scope body opening brace.
 *
 * @param content - Existing scoped CSS content.
 * @returns Zero-based insertion index, or -1 when no scope body is found.
 */
function findScopeBodyStart(content: string): number {
  let parenDepth = 0

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]

    if (ch === '(') {
      parenDepth++
    } else if (ch === ')') {
      parenDepth--
    } else if (ch === '{' && parenDepth === 0) {
      return i + 1
    }
  }

  return -1
}

/**
 * Removes the previously injected runtime layer block from CSS content.
 *
 * @param content - Existing scoped CSS content.
 * @returns CSS content without stale runtime layers.
 */
function removeStaleGlobalLayers(content: string): string {
  const start = content.indexOf(THEME_BLOCK_START)
  const end = content.indexOf(THEME_BLOCK_END)

  if (start === -1 || end === -1 || end < start) {
    return content
  }

  return (content.slice(0, start) + content.slice(end + THEME_BLOCK_END.length)).trimStart()
}

/**
 * Builds a deterministic runtime layer block from CSS variables.
 *
 * @param rootVariables - Variables to inject into the scope block.
 * @returns Runtime CSS layer block.
 */
function buildLayersBlock(rootVariables: Record<string, string>): string {
  const appendedVariables = Object.entries(rootVariables)
    .map(([varName, varValue]) => `  ${varName}: ${varValue};`)
    .join('\n')

  return `${THEME_BLOCK_START}\n@layer tokens {\n:scope {\n${appendedVariables}\n}\n}\n@layer base {}\n${THEME_BLOCK_END}`
}

/**
 * Injects runtime layers into scoped CSS content.
 *
 * @param content - Existing scoped CSS content.
 * @param rootVariables - Variables to inject.
 * @returns Updated scoped CSS content.
 */
function insertLayersIntoScope(content: string, rootVariables: Record<string, string>): string {
  const layersBlock = buildLayersBlock(rootVariables)
  const cleaned = removeStaleGlobalLayers(content)
  const insertAfter = findScopeBodyStart(cleaned)

  if (insertAfter === -1) {
    return `${layersBlock}\n${cleaned}`
  }

  return cleaned.slice(0, insertAfter) + `\n${layersBlock}\n` + cleaned.slice(insertAfter)
}

/**
 * Applies theme variables to the scoped style element for a given style id.
 */
type ThemePayload = {
  properties?: Record<string, Record<string, unknown>>
}

/**
 * Applies runtime theme variables to matching scoped style tags and scope roots.
 *
 * @param theme - Theme payload containing nested properties.
 * @param styleId - Target style id used for scoped lookup.
 * @returns Nothing.
 */
export default function applyThemeVariables(theme: ThemePayload, styleId: string) {
  if (!theme?.properties) {
    return
  }

  const cssVariables = mapThemeToCSSVariables(theme.properties)
  const rootVariables = toRootVariables(cssVariables)
  const candidateStyleIds = getCandidateStyleIds(styleId)

  // First-render safety: define vars directly on scope roots.
  // This avoids race conditions where style tags are created after theme event.
  applyVariablesToScopeRoots(rootVariables, candidateStyleIds)

  const scopedElements = queryScopedStyleElements(candidateStyleIds)

  if (!scopedElements.length) {
    console.warn(`Style element with data-app-styles="${styleId}" not found; theme vars were applied on scope root.`)

    return
  }

  for (const scopedElement of scopedElements) {
    const currentContent = scopedElement.textContent || ''
    scopedElement.textContent = insertLayersIntoScope(currentContent, rootVariables)
  }
}
