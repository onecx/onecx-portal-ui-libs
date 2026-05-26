/**
 * Flattens a nested theme properties object into key-value pairs.
 */
const THEME_BLOCK_START = '/* app-theme-runtime:start */'
const THEME_BLOCK_END = '/* app-theme-runtime:end */'

function normalizeThemeValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim()

  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`
  }

  return undefined
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase()
}

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

function applyVariablesToScopeRoots(
  variables: Record<string, string>,
  candidateStyleIds: string[],
  queryRoot: ParentNode
): void {
  const roots: HTMLElement[] = []

  for (const candidateId of candidateStyleIds) {
    queryRoot
      .querySelectorAll(`[data-style-id="${candidateId}"], [data-intermediate-style-id="${candidateId}"]`)
      .forEach((el) => roots.push(el as HTMLElement))
  }

  roots.forEach((root) => {
    Object.entries(variables).forEach(([name, value]) => {
      root.style.setProperty(name, value)
    })
  })
}

function toRootVariables(cssVariables: Record<string, string>): Record<string, string> {
  const rootVariables: Record<string, string> = { ...cssVariables }

  Object.entries(cssVariables).forEach(([name, value]) => {
    const withoutAppPrefix = `--${name.slice('--app-'.length)}`
    rootVariables[withoutAppPrefix] = value
  })

  return rootVariables
}

function getCandidateStyleIds(styleId: string): string[] {
  const baseId = styleId.includes('|') ? styleId.split('|')[0] : styleId
  return styleId === baseId ? [styleId] : [styleId, baseId]
}

function queryScopedStyleElements(candidateStyleIds: string[], queryRoot: ParentNode): HTMLElement[] {
  const scopedElements: HTMLElement[] = []

  for (const candidateId of candidateStyleIds) {
    queryRoot
      .querySelectorAll(`style[data-app-styles="${candidateId}"], style[data-app-primereact-style="${candidateId}"]`)
      .forEach((el) => scopedElements.push(el as HTMLElement))
  }

  return scopedElements
}

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

function removeStaleGlobalLayers(content: string): string {
  const start = content.indexOf(THEME_BLOCK_START)
  const end = content.indexOf(THEME_BLOCK_END)

  if (start === -1 || end === -1 || end < start) {
    return content
  }

  return (content.slice(0, start) + content.slice(end + THEME_BLOCK_END.length)).trimStart()
}

function buildLayersBlock(rootVariables: Record<string, string>): string {
  const appendedVariables = Object.entries(rootVariables)
    .map(([varName, varValue]) => `  ${varName}: ${varValue};`)
    .join('\n')

  return `${THEME_BLOCK_START}\n@layer tokens {\n:scope {\n${appendedVariables}\n}\n}\n@layer base {}\n${THEME_BLOCK_END}`
}

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

export default function applyThemeVariables(theme: ThemePayload, styleId: string, queryRoot: ParentNode = document) {
  if (!theme?.properties) {
    return
  }

  const cssVariables = mapThemeToCSSVariables(theme.properties)
  const rootVariables = toRootVariables(cssVariables)
  const candidateStyleIds = getCandidateStyleIds(styleId)

  // First-render safety: define vars directly on scope roots.
  // This avoids race conditions where style tags are created after theme event.
  applyVariablesToScopeRoots(rootVariables, candidateStyleIds, queryRoot)

  const scopedElements = queryScopedStyleElements(candidateStyleIds, queryRoot)

  if (!scopedElements.length) {
    console.warn(`Style element with data-app-styles="${styleId}" not found; theme vars were applied on scope root.`)

    return
  }

  for (const scopedElement of scopedElements) {
    const currentContent = scopedElement.textContent || ''
    scopedElement.textContent = insertLayersIntoScope(currentContent, rootVariables)
  }
}
