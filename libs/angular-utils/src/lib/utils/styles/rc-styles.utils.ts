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
  replaceStyleConent,
  slotNameToPropertyName,
} from './styles.utils'
import { scopeIdFromProductNameAndAppId } from '../scope.utils'
import { firstValueFrom } from 'rxjs'
import { Location } from '@angular/common'

/**
 * Create or updates style of the rc application
 */
export async function udpateStylesForRcCreation(
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
    return
  }
  const scopedCss = createScopedCss(css, scopeId)
  replaceStyleConent(styleElement, scopedCss)
}

/**
 * Remove usages of the rc from the style elements
 */
export function updateStyleForRcRemoval(productName: string, appId: string, slotName: string) {
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
 * Returns the count of Rc usages for style element
 */
export function getStyleUsageCountForRc(styleElement: HTMLStyleElement): number {
  return Object.keys(styleElement.dataset).filter((key) => key.startsWith(dataRcStylesStart)).length
}

/**
 * Registers the rc as the user of the style element
 */
function useStyleForRc(styleElement: HTMLStyleElement, slotName: string) {
  styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))] = ''
}

/**
 * Creates new style element and register rc as the user of it
 * @param scopeId - scope id related to the rc
 * @param slotName - rc instance slot name
 * @returns style element with rc registered
 */
function createStyleUsedByRc(scopeId: string, slotName: string): HTMLStyleElement {
  const element = addStyleToHead('', {
    [dataAppStylesKey]: scopeId,
  })
  useStyleForRc(element, slotName)
  return element
}

/**
 * Removes the rc from list of users of the style element
 */
function removeRcUsageFromStyle(styleElement: HTMLStyleElement, slotName: string) {
  removeAttributeFromStyle(styleElement, slotNameToPropertyName(dataRcStylesKey(slotName)))
}

/**
 * Returns all style elements used by the rc
 */
function getAllStylesUsedByRc(slotName: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${dataRcStylesAttribute(slotName)}]`))
}
