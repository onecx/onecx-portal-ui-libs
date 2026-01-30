import { scopeIdFromProductNameAndAppId } from "@onecx/angular-utils";
import { HttpClient } from "@angular/common/http";
import {
  getAppStyleByScope, 
  getStyleUsageCount, 
  fetchAppCss,
  dataAppStylesKey,
  useStyleForMfe, 
  useStyleForRc, 
  replaceStyleContent, 
  removeMfeUsageFromStyle,
  removeRcUsageFromStyle,
  createStyleUsedByMfeRc,
  createApplicationScopedCss,
  getAllStylesUsedByKey,
  dataMfeStylesAttribute,
  dataRcStylesAttribute
} from "../index";

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
export function updateStylesForMfeChange(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  mfeUrl: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    mfeUrl,
    {type:'mfe'},
    (document) => useStyleForMfe(document),
    (document) => removeMfeUsageFromStyle(document) 
  );
}

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
export function updateStylesForRcCreation(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  rcUrl: string,
  slotName: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    rcUrl,
    {type:'rc',slotName:slotName},
    (document) => useStyleForRc(document, slotName),
    (document) => removeRcUsageFromStyle(document,slotName) 
  );
}

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC or MFE application styles css and registers the MFE or RC for the usage depending on passed callback function.
 * If style element for application is already created, it only registers for the usage.
 * The old and unused style usages are removed based on a passed callback function.
 * @param productName - product name style belongs to
 * @param appId - id of the application style belongs to
 * @param httpClient - http client to make requests
 * @param url - url of the application to make requests
 * @param options - defines type of style together with the name of the slot hosting the style for RC
 * @param useStyleCallback - function used for style registration based on the style type
 * @param removeUsageFromStyleCallback - function used for style removal based on the style type
 */
async function updateStyles(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  url: string,
  options: {type:'rc',slotName:string} | {type:'mfe'},
  useStyleCallback: (document: HTMLStyleElement) => void,
  removeUsageFromStyleCallback: (document: HTMLStyleElement) => void
){
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  if(options.type === 'mfe') removeAllMfeUsagesFromStyles(scopeId)
  
  const existingStyleElement = getAppStyleByScope(scopeId)

  if (existingStyleElement) {
    useStyleCallback(existingStyleElement)
    return
  }

  const styleElement = createStyleUsedByMfeRc(scopeId, options)
  const css = await fetchAppCss(httpClient, url);
  (styleElement as any).onecxOriginalCss = css

  if (!css) {
    removeUsageFromStyleCallback(styleElement)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createApplicationScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}

/**
 * Removes usages for all MFEs not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
 *
 * @param scopeId - id of the scope to not deactivate
 */
export function removeAllMfeUsagesFromStyles(scopeId: string) {
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
 * @param scopeId - id of the scope to not deactivate
 * @param slotName - name of the slot hosting the RC
 */
export function removeAllRcUsagesFromStyles(scopeId: string, slotName: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataRcStylesAttribute(slotName)),
    (style) => removeRcUsageFromStyle(style,slotName)
  );
}


/**
 * Remove usage of the  RC or MFE style from elements it is registered for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param scopeId - id of the scope where the style has to be removed
 * @param styles - list of the style elements that have to be modified
 * @param removeUsageCallback - function used for style removal depending on style type
 */
function removeInactiveStyles(
    scopeId: string,
    styles: HTMLStyleElement[],
    removeUsageCallback: (style: HTMLStyleElement) => void
): void{  
  styles
    .filter((styleElement) => !(styleElement.dataset[dataAppStylesKey] === scopeId))
    .forEach((style) => {
      removeUsageCallback(style);
      if (getStyleUsageCount(style) === 0) {
        style.remove();
      }
    });
}