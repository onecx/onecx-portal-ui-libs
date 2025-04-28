import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
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
  replaceStyleConent,
  createScopedCss,
  fetchAppCss,
} from './styles.utils'

/**
 * Update all style elements related to app styles. It removes old mfe usages and unused style elements and creates or updates current mfe styles
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

  // Create new style element if none was found for the current mfe
  const styleElement = createStyleUsedByMfe(scopeId)
  const css = await fetchAppCss(httpClient, mfeUrl)
  if (!css) {
    removeMfeUsageFromStyle(styleElement)
    return
  }
  const scopedCss = createScopedCss(css, scopeId)
  replaceStyleConent(styleElement, scopedCss)
}

/**
 * Check if style is used by mfe
 */
export function isStyleUsedByMfe(styleElement: HTMLElement): boolean {
  return styleElement.dataset[dataMfeStylesKey] !== undefined
}

/**
 * Removes usages for all Mfes not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
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
 * Registers the mfe as the user of the style element
 */
function useStyleForMfe(styleElement: HTMLStyleElement) {
  styleElement.dataset[dataMfeStylesKey] = ''
}

/**
 * Creates new style element and register mfe as the user of it
 * @param scopeId - scope id related to the mfe
 * @returns style element with mfe registered
 */
function createStyleUsedByMfe(scopeId: string): HTMLStyleElement {
  const element = addStyleToHead('', {
    [dataAppStylesKey]: scopeId,
  })
  useStyleForMfe(element)
  return element
}

/**
 * Removes the mfe from list of users of the style element
 */
function removeMfeUsageFromStyle(styleElement: HTMLStyleElement) {
  removeAttributeFromStyle(styleElement, dataMfeStylesKey)
}

/**
 * Returns all style elements used by the mfe
 */
function getAllStylesUsedByMfe(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${dataMfeStylesAttribute}]`))
}
