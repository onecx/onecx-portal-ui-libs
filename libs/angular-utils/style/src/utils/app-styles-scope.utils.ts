import { dataMfeElementAttribute, dataNoPortalLayoutStylesAttribute, dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported} from "@onecx/angular-utils";
import { 
    dataAppStylesAttribute
} from "../index";

/**
 * Get the style element with application styles based on a scope.
 * @param scopeId - scope id related to the app
 * @returns {HTMLStyleElement | null} the style element related for a given scope
 */
export function getAppStyleByScope(scopeId: string): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>(`style[${dataAppStylesAttribute}="${scopeId}"]`)
}

/**
 * Replace ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootWithScope(css: string): string {
  return css.replaceAll(':root', ':scope')
}

/**
 * Replace "html" and ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootAndHtmlWithScope(css: string): string {
  return replaceRootWithScope(css.replaceAll('html',':scope'))
}

/**
 * Creates a string with application scoped css. The scope will apply the css to the element with given scopeId that has dataNoPortalLayoutStylesAttribute or dataMfeElementAttribute and will be available until element with dataStyleIsolationAttribute.
 * @param css - css for scoping
 * @param scopeId - scope id for scoping
 * @returns {string} css scoped by the given id
 */
export function createApplicationScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  const scopeSelector = `[${dataStyleIdAttribute}="${scopeId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])`
  // Apply styles to all v6 elements and the MFE
  return isScopeSupported
    ? `
      @scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}]) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
    : `
      @supports (@scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}])) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
}