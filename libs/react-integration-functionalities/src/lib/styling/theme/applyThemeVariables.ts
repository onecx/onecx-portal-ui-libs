/**
 * Flattens a nested theme properties object into key-value pairs.
 *
 * @param properties - Theme properties grouped by category.
 * @returns Flattened key-value theme properties.
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
 *
 * @param themeProperties - Flattened theme properties.
 * @returns CSS variable name/value pairs.
 */
function mapThemeToCSSVariables(themeProperties: Record<string, any>): Record<string, string> {
  const flattenedProperties = flattenThemeProperties(themeProperties)
  const cssVariables: Record<string, string> = {}

  for (const [key, value] of Object.entries(flattenedProperties)) {
    const cssVarName = `--test-example-${key}`
    cssVariables[cssVarName] = value
  }

  return cssVariables
}

/**
 * Applies theme variables to the scoped style element for a given style id.
 *
 * @param theme - Theme payload containing properties.
 * @param styleId - Style identifier used to locate the scoped style tag.
 */
export default function applyThemeVariables(theme: any, styleId: string) {
  if (!theme?.properties) {
    return
  }

  const cssVariables = mapThemeToCSSVariables(theme.properties)

  const scopedElement = document.querySelector(`style[data-app-styles="${styleId}"]`)

  if (!scopedElement) {
    console.warn(`Style element with data-app-styles="${styleId}" not found`)
    return
  }

  let currentContent = scopedElement.textContent || ''

  // Find the :scope block and update CSS variables within it
  const scopeBlockRegex = /(:scope\s*{[^}]*})/g

  if (scopeBlockRegex.test(currentContent)) {
    // Update existing :scope block
    currentContent = currentContent.replaceAll(scopeBlockRegex, (match) => {
      // Parse existing variables and update/add new ones
      let updatedScopeContent = match

      Object.entries(cssVariables).forEach(([varName, varValue]) => {
        const escapedVarName = varName.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\\$&`)
        const varRegex = new RegExp(String.raw`(\s*${escapedVarName}\s*:\s*)[^;]+;`, 'g')

        if (varRegex.test(updatedScopeContent)) {
          // Update existing variable
          updatedScopeContent = updatedScopeContent.replaceAll(varRegex, `$1${varValue};`)
        } else {
          // Add new variable before the closing brace
          updatedScopeContent = updatedScopeContent.replaceAll(/}$/, `  ${varName}: ${varValue};\n}`)
        }
      })

      return updatedScopeContent
    })
  } else {
    console.warn(`No :scope block found in style element with data-app-styles="${styleId}"`)
  }

  scopedElement.textContent = currentContent

  console.log('Applying theme variables:', `style[data-app-styles="${styleId}"]`, scopedElement)
}
