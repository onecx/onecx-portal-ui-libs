import { HttpClient } from '@angular/common/http'
import {
  addStyleToHead,
  createScopedCss,
  dataAppStylesKey,
  dataRcStylesAttribute,
  dataRcStylesKey,
  dataRcStylesStart,
  fetchAppCss,
  getAppStyleByScope,
  getStyleUsageCount,
  isAppStyleForScope,
  removeAttributeFromStyle,
  replaceStyleContent,
  slotNameToPropertyName,
} from './styles.utils'
import { scopeIdFromProductNameAndAppId } from '../scope.utils'

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC application styles css and registers the RC for the usage.
 * If style element for the RC application is already created, it only registers for the usage.
 * @param productName - product name RC belongs to
 * @param appId - id of the application RC belongs to
 * @param httpClient - http client to make requests
 * @param rcUrl - url of the RC application to make requests
 * @param slotName - name of the slot hosting the RC
 */
export async function updateStylesForRcCreation(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  rcUrl: string,
  slotName: string
) {
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  const existingStyleElement = getAppStyleByScope(scopeId)
  if (existingStyleElement) {
    useStyleForRc(existingStyleElement, slotName)
    return
  }

  // Create new style element if none was found for the component
  const styleElement = createStyleUsedByRc(scopeId, slotName)
  const css = await fetchAppCss(httpClient, rcUrl)
  if (!css) {
    removeRcUsageFromStyle(styleElement, slotName)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}

/**
 * Update page styles.
 *
 * Remove usages of the RC from the style elements it is register for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param productName - product name RC belongs to
 * @param appId - id of the application RC belongs to
 * @param slotName - name of the slot hosting the RC
 */
export function updateStylesForRcRemoval(productName: string, appId: string, slotName: string) {
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  const componentStyles = getAllStylesUsedByRc(slotName)
  componentStyles
    .filter((styleElement) => isAppStyleForScope(styleElement, scopeId))
    .forEach((styleElement) => {
      removeRcUsageFromStyle(styleElement, slotName)
      if (getStyleUsageCount(styleElement) === 0) {
        styleElement.remove()
      }
    })
}

/**
 * Returns the count of RCs using a given style element.
 * @param styleElement - style element to check
 * @returns {number} the count of RCs using a given style element
 */
export function getStyleUsageCountForRc(styleElement: HTMLStyleElement): number {
  return Object.keys(styleElement.dataset).filter((key) => key.startsWith(dataRcStylesStart)).length
}

/**
 * Registers the RC as a user of the style element.
 * @param styleElement - style element to register for
 * @param slotName - name of the slot hosting the RC
 */
function useStyleForRc(styleElement: HTMLStyleElement, slotName: string) {
  styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))] = ''
}

/**
 * Creates new style element and register RC as a user of it.
 * @param scopeId - scope id related to the RC
 * @param slotName - name of the slot hosting the RC
 * @returns {HTMLStyleElement} style element with RC registration
 */
function createStyleUsedByRc(scopeId: string, slotName: string): HTMLStyleElement {
  const element = addStyleToHead('', {
    [dataAppStylesKey]: scopeId,
  })
  useStyleForRc(element, slotName)
  return element
}

/**
 * Removes the RC from list of users of the style element.
 * @param styleElement - style element to modify
 * @param slotName - name of the slot hosting the RC
 */
function removeRcUsageFromStyle(styleElement: HTMLStyleElement, slotName: string) {
  removeAttributeFromStyle(styleElement, slotNameToPropertyName(dataRcStylesKey(slotName)))
}

/**
 * Returns all style elements used by the RC.
 * @param slotName - name of the slot hosting the RC
 * @returns {HTMLStyleElement[]} list of style elements used by RC
 */
function getAllStylesUsedByRc(slotName: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${dataRcStylesAttribute(slotName)}]`))
}
