import {
    dataStyleIdAttribute,
    dataNoPortalLayoutStylesAttribute,
    dataMfeElementAttribute,
    isCssScopeRuleSupported,
    dataStyleIsolationAttribute,
} from '@onecx/angular-utils'


/**
 * Replace ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootWithScope(css: string): string {
  return css.replaceAll(':root', ':scope')
}

/**
 * Replace "html" and ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootAndHtmlWithScope(css: string): string {
  return replaceRootWithScope(css.replaceAll('html',':scope'))
}

/**
 * Creates a string with application scoped css. The scope will apply the css to the element with given scopeId that has dataNoPortalLayoutStylesAttribute or dataMfeElementAttribute and will be available until element with dataStyleIsolationAttribute.
 * @param css - css for scoping
 * @param scopeId - scope id for scoping
 * @returns {string} css scoped by the given id
 */
export function createScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  // Apply styles to all v6 elements and the MFE
  return isScopeSupported
    ? `
@scope([${dataStyleIdAttribute}="${scopeId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])) to ([${dataStyleIsolationAttribute}]) {
  ${replaceRootAndHtmlWithScope(css)}
    }
`
    : `
@supports (@scope([${dataStyleIdAttribute}="${scopeId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])) to ([${dataStyleIsolationAttribute}])) {
  ${replaceRootAndHtmlWithScope(css)}
    }
`
}

/**
 * Creates new style sheet with given content and optional dataset attributes and appends it to the document head.
 * @param content - content for new style sheet
 * @param datasetAttributes - attributes to add to new style element
 * @returns {HTMLStyleElement} new style element
 */
export function addStyleToHead(content: string, datasetAttributes?: { [key: string]: string }): HTMLStyleElement {
  const style = document.createElement('style')

  style.appendChild(document.createTextNode(content))
  if (datasetAttributes) {
    Object.keys(datasetAttributes).forEach((key) => {
      style.dataset[key] = datasetAttributes[key]
    })
  }
  document.head.appendChild(style)
  return style
}

/**
 * Replaces content of a given style element.
 * @param selectorOrElement - selector for a style element or exact element
 * @param content - content to be put in the style element
 * @returns {HTMLStyleElement} updated style element
 */
export function replaceStyleContent(
  selectorOrElement: string | HTMLStyleElement,
  content: string
): HTMLStyleElement | null {
  if (selectorOrElement instanceof HTMLStyleElement) {
    selectorOrElement.textContent = content
    return selectorOrElement
  }

  const styleElement = document.head.querySelector<HTMLStyleElement>(selectorOrElement)
  if (styleElement) styleElement.textContent = content
  return styleElement
}
