import { scopeIdFromProductNameAndAppId } from "@onecx/angular-utils";
import { 
    dataAppStylesKey, 
    dataMfeStylesAttribute, 
    getAllStylesUsedByKey,
    getStyleUsageCount, 
    slotNameToPropertyName, 
    dataMfeStylesKey, 
    dataRcStylesAttribute, 
    dataRcStylesKey 
} from "../index";

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

/**
 * Removes usages for all MFEs not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
 *
 * @param scopeId - id of the scope to not deactivate
 */
export function updateInactiveMfeStyles(scopeId: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataMfeStylesAttribute),
    (style) => removeMfeUsageFromStyle(style)
  );
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
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataRcStylesAttribute(slotName)),
    (style) => removeRcUsageFromStyle(style,slotName)
  );
}

function removeInactiveStyles(
    scopeId: string,
    styles: HTMLStyleElement[],
    removeUsage: (style: HTMLStyleElement) => void
): void{  
  styles
    .filter((styleElement) => !(styleElement.dataset[dataAppStylesKey] === scopeId))
    .forEach((style) => {
      removeUsage(style);
      if (getStyleUsageCount(style) === 0) {
        style.remove();
      }
    });
}