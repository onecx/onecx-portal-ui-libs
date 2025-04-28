import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported } from '../scope.utils'
import { isStyleUsedByMfe } from './mfe-styles.utils'
import { getStyleUsageCountForRc } from './rc-styles.utils'
import { catchError, firstValueFrom, mergeMap, of, throwError } from 'rxjs'
import { Location } from '@angular/common'

// Style isolation management
export const dataRcStylesStart = 'slot'
export function slotNameToPropertyName(slotName: string) {
  return slotName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

export const dataAppStylesKey = 'appStyles'
export const dataMfeStylesKey = 'mfeStyles'
export const dataRcStylesKey = (slotName: string) =>
  `${dataRcStylesStart}${slotName.replace(slotName.charAt(0), slotName.charAt(0).toUpperCase())}Styles`
export const dataShellStylesKey = `shellStyles`

export const dataAppStylesAttribute = 'data-app-styles'
export const dataMfeStylesAttribute = 'data-mfe-styles'
export const dataRcStylesAttribute = (slotName: string) => `data-${dataRcStylesStart}-${slotName}-styles`
export const dataShellStylesAttribute = `data-shell-styles`

/**
 * Extract :root variables from a given css
 */
export function extractRootCssVariables(css: string): string {
  const matches = css.match(/:root\s*\{[^}]*\}/g)
  if (!matches) return ''

  return matches.join(' ')
}

/**
 * Extract everything apart from :root variables from a given css
 */
export function extractCssStyles(css: string): string {
  return css.replace(/:root\s*\{[^}]*\}/g, '')
}

/**
 * Returns string with variables and styles scoped based on the provided id, from a given css
 * @param css - css for scoping
 * @param scopeId - scope id related to the mfe
 * @returns scoped css
 */
export function createScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  return isScopeSupported
    ? `
  ${extractRootCssVariables(css)}
@scope([${dataStyleIdAttribute}="${scopeId}"]) to ([${dataStyleIsolationAttribute}]) {
        ${extractCssStyles(css)}
    }
`
    : `
  ${extractRootCssVariables(css)}
@supports (@scope([${dataStyleIdAttribute}="${scopeId}"]) to ([${dataStyleIsolationAttribute}])) {
        ${extractCssStyles(css)}
    }
`
}

/**
 * Creates new style sheet with given content and optional dataset attributes and appends it to the document head
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
 * Replaces current content of a given style element with provided content
 */
export function replaceStyleConent(
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
 * Removes given attribute from style element's dataset
 */
export function removeAttributeFromStyle(styleElement: HTMLStyleElement, attribute: string): void {
  delete styleElement.dataset[attribute]
}

/**
 * Returns the style element related for a given scope
 * @param scopeId - scope id related to the app
 * @returns the style element related for a given scope
 */
export function getAppStyleByScope(scopeId: string): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>(`style[${dataAppStylesAttribute}="${scopeId}"]`)
}

/**
 * Returns the count of Mfe and Rc usages for style element
 */
export function getStyleUsageCount(styleElement: HTMLStyleElement): number {
  let usages = 0
  if (isStyleUsedByMfe(styleElement)) usages++
  usages += getStyleUsageCountForRc(styleElement)
  return usages
}

/**
 * Checks if style is an app style
 */
export function isAppStyle(styleElement: HTMLStyleElement): boolean {
  return styleElement.dataset[dataAppStylesKey] !== undefined
}

/**
 * Checks if style is related to an app with given scope
 */
export function isAppStyleForScope(styleElement: HTMLStyleElement, scopeId: string): boolean {
  return styleElement.dataset[dataAppStylesKey] === scopeId
}

/**
 * Fetches the css for an application
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
                  `Application returned different content type than text/css: ${response.headers.get('Content-Type')}`
                )
            )
          }

          return of(response.body)
        }),
        catchError((error: Error) => {
          console.error(`Error while loading app css for ${appUrl}: ${error.message}`)
          return of(undefined)
        })
      )
  )
}

/**
 * Creates HttpHeaders for Css request
 */
function createCssRequestHeaders() {
  return new HttpHeaders({}).set('Accept', 'text/css')
}

/**
 * Returns if response is valid css
 */
function isResponseValidCss<T>(response: HttpResponse<T>) {
  return response.headers.get('Content-Type') === 'text/css'
}
