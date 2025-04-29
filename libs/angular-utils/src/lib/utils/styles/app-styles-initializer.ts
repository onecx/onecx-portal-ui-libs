import { inject, provideEnvironmentInitializer } from '@angular/core'
import { getAppStyleByScope, replaceStyleContent } from './styles.utils'
import { getScopeIdentifier, replacePrimengPrefix } from '../scope.utils'
import { AppStateService, REMOTE_COMPONENT_CONFIG } from '@onecx/angular-integration-interface'
import { SKIP_STYLE_SCOPING } from '../../services/custom-use-style.service'

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
