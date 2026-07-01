import {
  dataIntermediateNoPortalLayoutStylesKey,
  dataIntermediateStyleIdKey,
  dataNoPortalLayoutStylesKey,
  dataStyleIdKey,
  getInjector,
  StyleData,
  dataIntermediateMfeElementKey,
  dataMfeElementKey,
} from '@onecx/angular-utils'
import { dataAppStylesKey, useStyleForMfe, useStyleForRc } from '../index'
import { APP_ID } from '@angular/core'

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

/**
 * Creates new style element and register MFE or RC as the user of it
 * @param scopeId - scope id related to the app
 * @param options - registration options
 * @returns {HTMLStyleElement} style element with MFE or RC registered
 */
export function createStyleUsedByMfeRc(
  scopeId: string,
  options: { type: 'rc'; slotName: string } | { type: 'mfe' }
): HTMLStyleElement {
  const element = addStyleToHead('', {
    [dataAppStylesKey]: scopeId,
  })

  if (options.type === 'rc') {
    useStyleForRc(element, options.slotName)
  } else {
    useStyleForMfe(element)
  }

  return element
}

/**
 * Retrieves style data for a given object from its injector. The style data is expected to be stored in the injector with a specific key.
 * @param object - The object to retrieve style data for
 * @returns The style data if found, otherwise null
 */
export function getStyleDataFromInjector(object: any) {
  const injector = getInjector(object)
  if (!injector) return null

  const appId = injector.get(APP_ID, null)
  const appElementName = (appId as any)?.appElementName as string
  if (!appElementName) return null

  const elements = document.getElementsByTagName(appElementName)
  const appElement = elements.length > 0 ? (elements[0] as HTMLElement) : null
  if (!appElement) return null

  return getStyleDataOrIntermediateStyleData(appElement)
}

/**
 * Gets the style data from an element or its intermediate style data if it exists.
 * @param element HTMLElement to get style data from
 * @returns StyleData object or null if no style data is found.
 */
export function getStyleDataOrIntermediateStyleData(element: Node | EventTarget): StyleData | null {
  const styleElement = findElementWithStyleDataOrIntermediateStyleData(element)
  if (!styleElement) return null

  return {
    styleId: styleElement.dataset[dataStyleIdKey] ?? styleElement.dataset[dataIntermediateStyleIdKey],
    noPortalLayoutStyles:
      styleElement.dataset[dataNoPortalLayoutStylesKey] ??
      styleElement.dataset[dataIntermediateNoPortalLayoutStylesKey],
    mfeElement: styleElement.dataset[dataMfeElementKey] ?? styleElement.dataset[dataIntermediateMfeElementKey],
  }
}

/**
 * Finds the closest parent element with style data or intermediate style data.
 * @param startNode Starting node to search from
 * @returns The closest parent element with style data or intermediate style data, or null if not found.
 */
export function findElementWithStyleDataOrIntermediateStyleData(startNode: Node | EventTarget): HTMLElement | null {
  let currentNode = startNode
  const hasStyleData = (node: HTMLElement) => node.dataset[dataStyleIdKey] || node.dataset[dataIntermediateStyleIdKey]
  while (currentNode instanceof HTMLElement && !hasStyleData(currentNode) && currentNode.parentElement) {
    currentNode = currentNode.parentElement
  }
  return currentNode instanceof HTMLElement && hasStyleData(currentNode) ? currentNode : null
}
