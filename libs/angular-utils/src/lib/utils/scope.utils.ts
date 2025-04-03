import { AppStateService } from '@onecx/angular-integration-interface'
import { RemoteComponentConfig } from '@onecx/angular-remote-components'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'

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
