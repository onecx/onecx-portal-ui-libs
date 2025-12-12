import { dataAppStylesAttribute, dataMfeStylesKey, dataRcStylesStart } from '../index'


/**
 * Get the style element for a scope.
 * @param scopeId - scope id related to the app
 * @returns {HTMLStyleElement | null} the style element related for a given scope
 */
export function getAppStyleByScope(scopeId: string): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>(`style[${dataAppStylesAttribute}="${scopeId}"]`)
}

/**
 * Returns the count of MFEs and RCs using the style element.
 * @param styleElement - style element
 * @returns {number} number of MFEs and RCs using the style element
 */
export function getStyleUsageCount(styleElement: HTMLStyleElement): number {
  let usages = 0
  if (isStyleUsedByMfe(styleElement)) usages++
  usages += getStyleUsageCountForRc(styleElement)
  return usages
}

/**
 * Returns formatted string that reflects property name with given slot name
 * @param slotName - name of the slot hosting
 * @returns {string} - changed slot name which is a property name
 */
export function slotNameToPropertyName(slotName: string) : string{
  return slotName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
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
 * Returns the count of RCs using a given style element.
 * @param styleElement - style element to check
 * @returns {number} the count of RCs using a given style element
 */
export function getStyleUsageCountForRc(styleElement: HTMLStyleElement): number {
  return Object.keys(styleElement.dataset).filter((key) => key.startsWith(dataRcStylesStart)).length
}

/**
 * Returns all style elements with styles registered with attribute key
 * @param key - style attribute key associated with html element style
 * @returns {HTMLStyleElement[]} - a list of html elements with matching attribute key
 */
export function getAllStylesUsedByKey(key: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${key}]`))
}