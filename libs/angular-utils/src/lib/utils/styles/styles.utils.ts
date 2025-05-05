import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported } from '../scope.utils'
import { isStyleUsedByMfe } from './mfe-styles.utils'
import { getStyleUsageCountForRc } from './rc-styles.utils'
import { catchError, firstValueFrom, mergeMap, of, throwError } from 'rxjs'
import { Location } from '@angular/common'

export const dataRcStylesStart = 'slot'
export function slotNameToPropertyName(slotName: string) {
  return slotName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * @constant {string} dataAppStylesKey
 * @description Marks style element as one containing styles for scopeId (which is based on the application)
 * Such style sheet contains variables applied globally and CSS scoped to a given scope until style isolation.
 * (e.g. data-app-styles="onecx-workspace|onecx-workspace-ui")
 */
export const dataAppStylesKey = 'appStyles'

/**
 * @constant {string} dataMfeStylesKey
 * @description Marks style element as one used by the current MFE.
 */
export const dataMfeStylesKey = 'mfeStyles'

/**
 * @function dataRcStylesKey
 * @description Marks style element as one used by any component in a slot given by the SLOT_NAME.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The key for the slot styles.
 */
export const dataRcStylesKey = (slotName: string) =>
  `${dataRcStylesStart}${slotName.replace(slotName.charAt(0), slotName.charAt(0).toUpperCase())}Styles`

/**
 * @constant {string} dataShellStylesKey
 * @description Marks style element as one containing styles for the shell.
 * Such style sheet contains variables applied globally and CSS scoped to a shell scope until style isolation.
 */
export const dataShellStylesKey = 'shellStyles'

/**
 * @constant {string} dataAppStylesAttribute
 * @description HTML attribute for appStyles. See {@link dataAppStylesKey} for more details.
 */
export const dataAppStylesAttribute = 'data-app-styles'

/**
 * @constant {string} dataMfeStylesAttribute
 * @description HTML attribute for mfeStyles. See {@link dataMfeStylesKey} for more details.
 */
export const dataMfeStylesAttribute = 'data-mfe-styles'

/**
 * @function dataRcStylesAttribute
 * @description HTML attribute for slot styles. See {@link dataRcStylesKey} for more details.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The attribute for the slot styles.
 */
export const dataRcStylesAttribute = (slotName: string) => `data-${dataRcStylesStart}-${slotName}-styles`

/**
 * @constant {string} dataShellStylesAttribute
 * @description HTML attribute for shellStyles. See {@link dataShellStylesKey} for more details.
 */
export const dataShellStylesAttribute = 'data-shell-styles'

/**
 * Extract rules for ":root" selector from a given css.
 * @param css - css text to transform
 * @returns {string} css with only rules for ":root" selector
 */
export function extractRootRules(css: string): string {
  const matches = css.match(/:root\{([^\}]*)}/g)
  if (!matches) return ''

  // This removes the ":root{" and replaces last curly brace "}" with a semicolon ";".
  // Without this the css is invalid because the last property is never closed.
  const extractedRules = matches.map((match) => match.replace(/:root\s*\{/, '').slice(0, -1) + ';')
  return extractedRules.join(' ')
}

/**
 * Extract everything apart from rules for ":root" selector from a given css.
 * @param css - css text to transform
 * @returns {string} css without rules for ":root" selector
 */
export function extractNonRootRules(css: string): string {
  return css.replace(/:root\s*\{[^}]*\}/g, '')
}

/**
 * Creates a string with scoped css.
 * @param css - css for scoping
 * @param scopeId - scope id for scoping
 * @returns {string} css scoped by the given id
 */
export function createScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  return isScopeSupported
    ? `
    @scope([${dataStyleIdAttribute}="${scopeId}"]) to ([${dataStyleIsolationAttribute}]) {
        ${extractRootRules(css)}
        ${extractNonRootRules(css)}
    }
`
    : `
    @supports (@scope([${dataStyleIdAttribute}="${scopeId}"]) to ([${dataStyleIsolationAttribute}])) {
        ${extractRootRules(css)}
        ${extractNonRootRules(css)}
    }
`
}

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
 * Removes attribute from style element's dataset.
 * @param styleElement - style element to modify
 * @param attribute - attribute to remove
 */
export function removeAttributeFromStyle(styleElement: HTMLStyleElement, attribute: string): void {
  delete styleElement.dataset[attribute]
}

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
 * Checks if style is an app style
 * @param styleElement - style element to check
 * @returns {boolean} if style element is an app style element
 */
export function isAppStyle(styleElement: HTMLStyleElement): boolean {
  return styleElement.dataset[dataAppStylesKey] !== undefined
}

/**
 * Checks if style is related to an app with given scope
 * @param styleElement - style element to check
 * @param scopeId - id of a scope to check
 * @returns {boolean} if style element and app are related
 */
export function isAppStyleForScope(styleElement: HTMLStyleElement, scopeId: string): boolean {
  return styleElement.dataset[dataAppStylesKey] === scopeId
}

/**
 * Fetches the css for an application.
 * @param http - http client for making requests
 * @param appUrl - url of the application used for making requests
 * @returns {Promise<string | undefined | null>} application css content
 */
export async function fetchAppCss(http: HttpClient, appUrl: string): Promise<string | undefined | null> {
  return await firstValueFrom(
    http
      .get(Location.joinWithSlash(appUrl, 'styles.css'), {
        headers: createCssRequestHeaders(),
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        mergeMap((response) => {
          if (!isResponseValidCss(response)) {
            return throwError(
              () =>
                new Error(
                  `Application returned different content type than text/css: ${response.headers.get('Content-Type')}. Please, make sure that the application exposes the styles.css file.`
                )
            )
          }

          return of(response.body)
        }),
        catchError((error: Error) => {
          console.error(
            `Error while loading app css for ${appUrl}: ${error.message}.  Please, make sure that the application exposes the styles.css file in your application.`
          )
          return of(undefined)
        })
      )
  )
}

/**
 * Creates HttpHeaders for Css request.
 */
function createCssRequestHeaders() {
  return new HttpHeaders({}).set('Accept', 'text/css')
}

/**
 * Returns if response is valid css.
 * @param response - response to validate
 * @returns {boolean} if response is valid css
 */
function isResponseValidCss<T>(response: HttpResponse<T>) {
  return response.headers.get('Content-Type') === 'text/css'
}
