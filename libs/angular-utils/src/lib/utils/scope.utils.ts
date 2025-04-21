import { AppStateService } from '@onecx/angular-integration-interface'
import { RemoteComponentConfig } from '@onecx/angular-remote-components'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'

export const shellScopeId = 'shell-ui'

const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
// Style scope management
export const dataStyleIdKey = 'styleId'
export const dataStyleIsolationKey = 'styleIsolation'
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'
export const dataIntermediateStyleIdKey = 'intermediateStyleId'
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'
export const dataVariableOverrideIdKey = 'VariableOverrideId'

export const dataStyleIdAttribute = 'data-style-id'
export const dataStyleIsolationAttribute = 'data-style-isolation'
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-ssolation'
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'
export const dataVariableOverrideIdAttibute = 'data-variable-override-id'

// Style isolation management
export const dataAppStylesKey = 'appStyles'
export const dataMfeStylesKey = 'mfeStyles'
export const dataRcStylesKey = (slotName: string) => `${slotName}Styles`
export const dataShellStylesKey = `ShellStyles`
export const dataPortalLayoutStylesKey = `portalLayoutStylesStyles`
export const dataDynamicPortalLayoutStylesKey = `dynamicContentPortalLayoutStyles`

export const dataAppStylesAttribute = 'data-app-styles'
export const dataMfeStylesAttribute = 'data-mfe-styles'
export const dataRcStylesAttribute = (slotName: string) => `data-${slotName}-styles`
export const dataShellStylesAttribute = `data-shell-styles`
export const dataPortalLayoutStylesAttribute = `data-portal-layout-styles`
export const dataDynamicPortalLayoutStylesAttribute = `data-dynamic-content-portal-layout-styles`

export const portalLayoutStylesSheetId = `[${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])`
export const dynamicPortalLayoutStylesSheetId = `body>:not([${dataNoPortalLayoutStylesAttribute}])`

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

export function scopeStyle(css: string, scopeId: string) {
  const isScopeSupported = isCssScopeRuleSupported()
  if (scopeId === '') {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}])) {
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

export function replacePrefix(css: string, scopeId: string) {
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
