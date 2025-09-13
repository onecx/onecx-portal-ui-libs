import { HttpClient } from '@angular/common/http'
import { scopeIdFromProductNameAndAppId } from '../scope.utils'
import {
  addStyleToHead,
  dataAppStylesKey,
  dataMfeStylesAttribute,
  dataMfeStylesKey,
  getAppStyleByScope,
  getStyleUsageCount,
  isAppStyleForScope,
  removeAttributeFromStyle,
  replaceStyleContent,
  createScopedCss,
  fetchAppCss,
  addOriginalCssToStyleElement,
} from './styles.utils'

/**
 * Update page styles.
 *
 * It removes old mfe usages and unused style elements.
 * Loads and creates new style element with MFE application styles css and registers the MFE for the usage.
 * If style element for the MFE application is already created, it only registers for the usage.
 *
 * @param productName - product name MFE belongs to
 * @param appId - id of the application MFE belongs to
 * @param httpClient - http client to make requests
 * @param mfeUrl - url of the MFE application to make requests
 */
export async function updateStylesForMfeChange(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  mfeUrl: string
) {
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  updateInactiveMfeStyles(scopeId)

  const existingStyleElement = getAppStyleByScope(scopeId)

  if (existingStyleElement) {
    useStyleForMfe(existingStyleElement)
    return
  }

  // Create new style element if none was found for the current MFE
  const styleElement = createStyleUsedByMfe(scopeId)
  const css = await fetchAppCss(httpClient, mfeUrl)
  addOriginalCssToStyleElement(styleElement, css)
  if (!css) {
    removeMfeUsageFromStyle(styleElement)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}

/**
 * Check if style is used by MFE.
 * @param styleElement - style element to check
 * @returns {boolean} if style is used by the MFE
 */
export function isStyleUsedByMfe(styleElement: HTMLElement): boolean {
  return styleElement.dataset[dataMfeStylesKey] !== undefined
}

/**
 * Removes usages for all MFEs not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
 *
 * @param scopeId - id of the scope to not deactivate
 */
async function updateInactiveMfeStyles(scopeId: string) {
  const mfeStyles = getAllStylesUsedByMfe()
  mfeStyles
    .filter((styleElement) => !isAppStyleForScope(styleElement, scopeId))
    .forEach((styleElement) => {
      removeMfeUsageFromStyle(styleElement)
      if (getStyleUsageCount(styleElement) === 0) {
        styleElement.remove()
      }
    })
}

/**
 * Registers the MFE as a user of the style element.
 * @param styleElement - style element to modify
 */
function useStyleForMfe(styleElement: HTMLStyleElement) {
  styleElement.dataset[dataMfeStylesKey] = ''
}

/**
 * Creates new style element and register MFE as the user of it.
 * @param scopeId - scope id related to the MFE application
 * @returns {HTMLStyleElement} style element with MFE registered
 */
function createStyleUsedByMfe(scopeId: string): HTMLStyleElement {
  const element = addStyleToHead('', {
    [dataAppStylesKey]: scopeId,
  })
  useStyleForMfe(element)
  return element
}

/**
 * Removes the MFE from list of users of the style element.
 * @param styleElement - style element to modify
 */
function removeMfeUsageFromStyle(styleElement: HTMLStyleElement) {
  removeAttributeFromStyle(styleElement, dataMfeStylesKey)
}

/**
 * Returns all style elements used by the MFE.
 * @returns all style elements used by the MFE
 */
function getAllStylesUsedByMfe(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${dataMfeStylesAttribute}]`))
}
