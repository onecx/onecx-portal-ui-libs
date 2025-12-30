import { inject, provideEnvironmentInitializer } from '@angular/core'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { getScopeIdentifier, replacePrimengPrefix } from '@onecx/angular-utils'
import { AppStateService } from '@onecx/angular-integration-interface'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { getAppStyleByScope, replaceStyleContent } from '@onecx/angular-utils/style'

export function provideAppStylesInitializer() {
  return [provideEnvironmentInitializer(updateAppStyle)]
}

async function updateAppStyle() {
  const appStateService = inject(AppStateService)
  const skipStyleScoping = inject(SKIP_STYLE_SCOPING, { optional: true }) ?? undefined
  const remoteComponentConfig = inject(REMOTE_COMPONENT_CONFIG, { optional: true }) ?? undefined
  const scopeId = await getScopeIdentifier(appStateService, skipStyleScoping, remoteComponentConfig)

  const styleElement = getAppStyleByScope(scopeId)
  if (styleElement && styleElement.textContent) {
    replaceStyleContent(styleElement, replacePrimengPrefix(styleElement.textContent, scopeId))
  }
}
