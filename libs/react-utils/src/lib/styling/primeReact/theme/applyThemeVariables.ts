/**
 * Flattens a nested theme properties object into key-value pairs.
 */
function flattenThemeProperties(properties: any): Record<string, string> {
  const flattened: Record<string, string> = {}
  for (const category of Object.keys(properties)) {
    if (properties[category]) {
      for (const [key, value] of Object.entries(properties[category])) {
        if (value) {
          flattened[key] = String(value).trim()
        }
      }
    }
  }
  return flattened
}

/**
 * Maps theme properties to CSS custom property names.
 */
function mapThemeToCSSVariables(themeProperties: Record<string, any>): Record<string, string> {
  const flattenedProperties = flattenThemeProperties(themeProperties)
  const cssVariables: Record<string, string> = {}

  for (const [key, value] of Object.entries(flattenedProperties)) {
    const cssVarName = `--app${key}`
    cssVariables[cssVarName] = value
  }

  return cssVariables
}

/**
 * Applies theme variables to the scoped style element for a given style id.
 */
export default function applyThemeVariables(theme: any, styleId: string) {
  console.log('Theme varaibles', theme, styleId)
  if (!theme?.properties) {
    return
  }

  const cssVariables = mapThemeToCSSVariables(theme.properties)
  console.log('cssVariables', cssVariables)

  const baseStyleId = styleId.replace(/\|([^|]+)-ui$/, '|$1')
  const candidateStyleIds = styleId === baseStyleId ? [styleId] : [styleId, baseStyleId]

  const scopedElements: HTMLElement[] = []
  for (const candidateId of candidateStyleIds) {
    document
      .querySelectorAll(`style[data-app-styles="${candidateId}"], style[data-app-primereact-style="${candidateId}"]`)
      .forEach((el) => scopedElements.push(el as HTMLElement))
  }

  if (!scopedElements.length) {
    console.warn(`Style element with data-app-styles="${styleId}" not found`)
    return
  }

  const appendedVariables = Object.entries(cssVariables)
    .map(([varName, varValue]) => `  ${varName}: ${varValue};`)
    .join('\n')

  const ensureTokensLayer = (content: string) =>
    `@layer tokens {\n:scope {\n${appendedVariables}\n}\n}\n@layer base {}\n${content}`

  for (const scopedElement of scopedElements) {
    console.log(
      'applyThemeVariables: matched style tag',
      scopedElement.dataset.appStyles || scopedElement.dataset.appPrimereactStyle
    )

    let currentContent = scopedElement.textContent || ''

    const tokensStart = currentContent.indexOf('@layer tokens')
    const baseStart = currentContent.indexOf('@layer base')

    if (tokensStart === -1 || baseStart === -1 || baseStart <= tokensStart) {
      currentContent = ensureTokensLayer(currentContent)
    } else {
      const tokensBlock = currentContent.slice(tokensStart, baseStart)
      const scopeBlockRegex = /:scope\s*{[^}]*}/g
      const scopeBlocks = tokensBlock.match(scopeBlockRegex) || []
      const cssVarKeys = Object.keys(cssVariables)
      const targetScopeBlock =
        scopeBlocks.find((block) => cssVarKeys.some((varName) => block.includes(varName))) || scopeBlocks[0]

      if (!targetScopeBlock) {
        currentContent = ensureTokensLayer(currentContent)
      } else {
        const updatedScopeBlock = targetScopeBlock.replace(/:scope\s*{[^}]*}/, `:scope {\n${appendedVariables}\n}`)
        const updatedTokensBlock = tokensBlock.replace(targetScopeBlock, updatedScopeBlock)
        currentContent = currentContent.slice(0, tokensStart) + updatedTokensBlock + currentContent.slice(baseStart)
      }
    }

    scopedElement.textContent = currentContent

    console.log('Applying theme variables:', `style[data-app-styles="${styleId}"]`, scopedElement)
  }
}
