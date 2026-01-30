import { dataAppStylesKey, useStyleForMfe, useStyleForRc } from '../index'

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
    options: {type:'rc'; slotName: string} | {type: 'mfe'}
): HTMLStyleElement {    
    const element = addStyleToHead('', {
        [dataAppStylesKey]: scopeId,
    });

    if (options.type === 'rc') {
        useStyleForRc(element, options.slotName);
    } else {
        useStyleForMfe(element);
    }

    return element;
}