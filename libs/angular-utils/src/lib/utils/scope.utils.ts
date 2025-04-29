import { AppStateService, RemoteComponentConfig } from '@onecx/angular-integration-interface'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'

export const shellScopeId = 'shell-ui'

const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
// Style scope management
// Variables for attributes and html element dataset keys for managing the scoping of styles
// StyleId
// data-style-id="scopeId"
// Marks start of scope section for scopeId (e.g. data-style-id="onecx-workspace|onecx-workspace-ui")
// Present for MFE and RC components as well as dynamic content
//
// StyleIsolation
// data-style-isolation
// Marks end of scope section
// Present for MFE and RC components as well as dynamic content
//
// NoPortalLayoutStyles
// data-no-portal-layout-styles
// Should always be in pair with styleId
// Marks that scope section does not request portal layout styles
// Present for MFE and RC components as well as dynamic content since libs v6
//
// IntermediateStyleId
// data-intermediate-style-id="scopeId" (e.g. data-intermediate-style-id="onecx-workspace|onecx-workspace-ui")
// Metadata used when appending dynamic content to ensure style scoping outside the application
//
// IntermediateStyleIsolation
// data-intermediate-style-isolation
// Metadata used when appending dynamic content to ensure style scoping outside the application
//
// IntermediateNoPortalLayoutStyles
// data-intermediate-no-portal-layout-styles
// Metadata used when appending dynamic content to ensure style scoping outside the application
//
// VariableOverrideId
// data-variable-override-id="scopeId"
// Marks the style element as one containing overrides for scope sections with scopeId
//
// PortalLayoutStylesStyles
// data-portal-layout-styles-styles
// Marks the style element as one containing portal layout styles styles
//
//
// DynamicPortalLayoutStyles
// data-dynamic-portal-layout-styles
// Marks the style element as one containing portal layout styles styles for the dynamic content

export const dataStyleIdKey = 'styleId'
export const dataStyleIsolationKey = 'styleIsolation'
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'
export const dataIntermediateStyleIdKey = 'intermediateStyleId'
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'
export const dataVariableOverrideIdKey = 'VariableOverrideId'
export const dataPortalLayoutStylesKey = `portalLayoutStylesStyles`
export const dataDynamicPortalLayoutStylesKey = `dynamicContentPortalLayoutStyles`

export const dataStyleIdAttribute = 'data-style-id'
export const dataStyleIsolationAttribute = 'data-style-isolation'
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-ssolation'
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'
export const dataVariableOverrideIdAttibute = 'data-variable-override-id'

export const dataPortalLayoutStylesAttribute = `data-portal-layout-styles`
export const dataDynamicPortalLayoutStylesAttribute = `data-dynamic-content-portal-layout-styles`

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
  skipStyleScoping?: boolean,
  remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>
) {
  let scopeId = ''
  if (!skipStyleScoping) {
    if (remoteComponentConfig) {
      const rcConfig = await firstValueFrom(remoteComponentConfig)
      scopeId = `${rcConfig.productName}|${rcConfig.appId}`
    } else {
      scopeId = await firstValueFrom(
        appStateService.currentMfe$.pipe(map((mfeInfo) => `${mfeInfo.productName}|${mfeInfo.appId}`))
      )
    }
  }
  return scopeId
}

// If scope rule is not supported, its wrapped via supports rule to be handled by the polyfill
export function scopeStyle(css: string, scopeId: string) {
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
  return `${productName}|${appId}`
}

export function isCssScopeRuleSupported() {
  return typeof CSSScopeRule !== 'undefined'
}
