import { dataMfeStylesKey, dataRcStylesKey, dataRcStylesStart } from '../index'
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

/**
 * Removes the MFE from list of users of the style element.
 * @param styleElement - style element to modify
 */
export function removeMfeUsageFromStyle(styleElement: HTMLStyleElement) {
    delete styleElement.dataset[dataMfeStylesKey]
}

/**
 * Removes the RC from list of users of the style element.
 * @param styleElement - style element to modify
 * @param slotName - name of the slot hosting the RC
 */
export function removeRcUsageFromStyle(styleElement: HTMLStyleElement, slotName: string) {
    delete styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))]
}

/**
 * Registers the RC as a user of the style element.
 * @param styleElement - style element to register for
 * @param slotName - name of the slot hosting the RC
 */
export function useStyleForRc(styleElement: HTMLStyleElement, slotName: string) {
  styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))] = ''
}

/**
 * Registers the MFE as a user of the style element.
 * @param styleElement - style element to modify
 */
export function useStyleForMfe(styleElement: HTMLStyleElement) {
  styleElement.dataset[dataMfeStylesKey] = ''
}
