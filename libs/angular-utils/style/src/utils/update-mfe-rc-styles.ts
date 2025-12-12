import { scopeIdFromProductNameAndAppId } from "@onecx/angular-utils";
import { getAppStyleByScope, getStyleUsageCount } from "./app-style-helper";
import { HttpClient } from "@angular/common/http";
import { fetchAppCss } from "../services/fetch-app-css.service";
import { addStyleToHead, createScopedCss, replaceStyleContent } from "./dom-style-config";
import { removeMfeUsageFromStyle, removeRcUsageFromStyle, updateInactiveMfeStyles, useStyleForMfe, useStyleForRc } from "./manage-mfe-rc-styles";
import { dataAppStylesKey } from "../preset/style-variables";

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
    (el) => useStyleForMfe(el),
    (el) => removeMfeUsageFromStyle(el) 
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
    (el) => useStyleForRc(el, slotName),
    (el) => removeRcUsageFromStyle(el,slotName) 
  );
}

async function updateStyles(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  url: string,
  options: {type:'rc',slotName:string} | {type:'mfe'},
  useStyle: (el: HTMLStyleElement) => void,
  removeUsageFromStyle: (el: HTMLStyleElement) => void
){
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  if(options.type === 'mfe') updateInactiveMfeStyles(scopeId)
  
  const existingStyleElement = getAppStyleByScope(scopeId)

  if (existingStyleElement) {
    useStyle(existingStyleElement)
    return
  }

  const styleElement = createStyleUsedByMfeRc(scopeId, options)
  const css = await fetchAppCss(httpClient, url);
  (styleElement as any).onecxOriginalCss = css

  if (!css) {
    removeUsageFromStyle(styleElement)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}