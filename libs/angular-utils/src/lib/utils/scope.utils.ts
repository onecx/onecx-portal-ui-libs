import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

export const shellScopeId = 'shell-ui'

const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
/**
 * @constant {string} dataStyleIdKey
 * @description Marks start of scope section for scopeId (e.g. data-style-id="onecx-workspace|onecx-workspace-ui")
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIdKey = 'styleId'

/**
 * @constant {string} dataStyleIsolationKey
 * @description Marks end of scope section
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIsolationKey = 'styleIsolation'

/**
 * @constant {string} dataNoPortalLayoutStylesKey
 * @description Should always be in pair with styleId
 * Marks that scope section does not request portal layout styles
 * Present for MFE and RC components as well as dynamic content since libs v6
 */
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'

/**
 * @constant {string} dataMfeElementKey
 * @description Marks element as the mfe content
 * Marks that scope section does not request portal layout styles
 * Present for MFE and its dynamic content
 */
export const dataMfeElementKey = 'mfeElement'

/**
 * @constant {string} dataIntermediateStyleIdKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 * (e.g. data-intermediate-style-id="onecx-workspace|onecx-workspace-ui")
 */
export const dataIntermediateStyleIdKey = 'intermediateStyleId'

/**
 * @constant {string} dataIntermediateMfeElementKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateMfeElementKey = 'intermediateMfeElement'

/**
 * @constant {string} dataIntermediateStyleIsolationKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'

/**
 * @constant {string} dataVariableOverrideIdKey
 * @description Marks the style element as one containing overrides for scope sections with scopeId
 */
export const dataVariableOverrideIdKey = 'VariableOverrideId'

/**
 * @constant {string} dataPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles
 */
export const dataPortalLayoutStylesKey = 'portalLayoutStylesStyles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles for the dynamic content
 */
export const dataDynamicPortalLayoutStylesKey = 'dynamicContentPortalLayoutStyles'

/**
 * @constant {string} dataStyleIdAttribute
 * @description HTML attribute for styleId. See {@link dataStyleIdKey} for more details.
 */
export const dataStyleIdAttribute = 'data-style-id'

/**
 * @constant {string} dataMfeElementAttribute
 * @description HTML attribute for mfe element. See {@link dataMfeElementKey} for more details.
 */
export const dataMfeElementAttribute = 'data-mfe-element'

/**
 * @constant {string} dataStyleIsolationAttribute
 * @description HTML attribute for styleIsolation. See {@link dataStyleIsolationKey} for more details.
 */
export const dataStyleIsolationAttribute = 'data-style-isolation'

/**
 * @constant {string} dataNoPortalLayoutStylesAttribute
 * @description HTML attribute for noPortalLayoutStyles. See {@link dataNoPortalLayoutStylesKey} for more details.
 */
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'

/**
 * @constant {string} dataIntermediateStyleIdAttribute
 * @description HTML attribute for intermediateStyleId. See {@link dataIntermediateStyleIdKey} for more details.
 */
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'

/**
 * @constant {string} dataIntermediateMfeElementAttribute
 * @description HTML attribute for intermediateMfeElement. See {@link dataIntermediateMfeElementKey} for more details.
 */
export const dataIntermediateMfeElementAttribute = 'data-intermediate-mfe-element'

/**
 * @constant {string} dataIntermediateStyleIsolationAttribute
 * @description HTML attribute for intermediateStyleIsolation. See {@link dataIntermediateStyleIsolationKey} for more details.
 */
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-isolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesAttribute
 * @description HTML attribute for intermediateNoPortalLayoutStyles. See {@link dataIntermediateNoPortalLayoutStylesKey} for more details.
 */
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'

/**
 * @constant {string} dataVariableOverrideIdAttribute
 * @description HTML attribute for variableOverrideId. See {@link dataVariableOverrideIdKey} for more details.
 */
export const dataVariableOverrideIdAttribute = 'data-variable-override-id'

/**
 * @constant {string} dataPortalLayoutStylesAttribute
 * @description HTML attribute for portalLayoutStyles. See {@link dataPortalLayoutStylesKey} for more details.
 */
export const dataPortalLayoutStylesAttribute = 'data-portal-layout-styles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesAttribute
 * @description HTML attribute for dynamicPortalLayoutStyles. See {@link dataDynamicPortalLayoutStylesKey} for more details.
 */
export const dataDynamicPortalLayoutStylesAttribute = 'data-dynamic-content-portal-layout-styles'

export const portalLayoutStylesSheetId = `[${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])`
export const dynamicPortalLayoutStylesSheetId = `body>:not([${dataNoPortalLayoutStylesAttribute}])`

/**
 * Gets the scope identifier based on the application context
 */
// Style scoping should be skipped for Shell
// For Remote Components application data from config is taken
// For MFE data from currentMfe topic is taken
export async function getScopeIdentifier(
  appStateService: AppStateService,
  skipStyleScoping?: boolean | null,
  remoteComponentConfig?: ReplaySubject<RemoteComponentConfig> | null
) {
  let scopeId = ''
  if (!skipStyleScoping) {
    if (remoteComponentConfig) {
      const rcConfig = await firstValueFrom(remoteComponentConfig)
      scopeId = scopeIdFromProductNameAndAppId(rcConfig.productName, rcConfig.appId)
    } else {
      scopeId = await firstValueFrom(
        appStateService.currentMfe$.pipe(
          map((mfeInfo) => scopeIdFromProductNameAndAppId(mfeInfo.productName, mfeInfo.appId))
        )
      )
    }
  }
  return scopeId
}

// If scope rule is not supported, its wrapped via supports rule to be handled by the polyfill
export function scopePrimengCss(css: string, scopeId: string) {
  const isScopeSupported = isCssScopeRuleSupported()
  if (scopeId === '') {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  } else {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  }
}

// Primeng variables have --p- prefix and style scoping requires each scope to have its own version of such variable
export function replacePrimengPrefix(css: string, scopeId: string) {
  if (scopeId === '') {
    return css
  }

  return css.replaceAll('--p-', scopeIdentifierToVariablePrefix(scopeId))
}

export function scopeIdentifierToVariablePrefix(scopeId: string) {
  return '--' + scopeId.replace(everythingNotACharacterOrNumberRegex, '-') + '-'
}

export function scopeIdFromProductNameAndAppId(productName: string, appId: string) {
  if (productName.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Name of the product is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  if (appId.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Id of the application is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  return `${productName}|${appId}`
}

export function isCssScopeRuleSupported() {
  return typeof CSSScopeRule !== 'undefined'
}
