import { firstValueFrom } from 'rxjs'
import {
  AppStateService,
  UserService,
  ThemeService,
  ConfigurationService,
  CONFIG_KEY,
  IAuthService,
} from '@onecx/angular-integration-interface'
import { MfeInfo } from '@onecx/integration-interface'
import { PortalApiService } from '../../services/portal-api.service'
import { UserProfileAPIService } from '../../services/userprofile-api.service'

const CONFIG_INIT_ERR = 'CONFIG_INIT_ERR'
const AUTH_INIT_ERR = 'AUTH_INIT_ERR'
const USER_INIT_ERR = 'USER_INIT_ERR'
const THEME_INIT_ERR = 'THEME_INIT_ERR'
const PORTAL_LOAD_INIT_ERR = 'PORTAL_LOAD_INIT_ERR'

/**
 * This initializer only runs in standalone mode of the apps and not in portal-mf-shell
 */
export function standaloneInitializer(
  auth: IAuthService,
  config: ConfigurationService,
  portalApi: PortalApiService,
  themeService: ThemeService,
  appName: string,
  appStateService: AppStateService,
  userService: UserService,
  userProfileAPIService: UserProfileAPIService
): () => Promise<any> {
  // eslint-disable-next-line no-restricted-syntax
  console.time('initializer')
  console.log(`⭐ Standalone initializer for: `, +appName)
  let errCause: string

  return async () => {
    try {
      let configOk = false
      try {
        configOk = await config.init()
        await config.isInitialized
      } catch (e) {
        errCause = CONFIG_INIT_ERR
        throw e
      }
      console.log(`📑 config OK? ${configOk}`)
      let authOk = false
      try {
        await appStateService.isAuthenticated$.isInitialized.then(() => (authOk = true))
      } catch (e) {
        errCause = AUTH_INIT_ERR
        throw e
      }
      console.log(`📑 auth OK? ${authOk}`)
      try {
        const profile = await firstValueFrom(userProfileAPIService.getCurrentUser())
        await userService.profile$.publish(profile)
      } catch (e) {
        errCause = USER_INIT_ERR
        throw e
      }
      console.log('📑 user initialized')
      let portal = undefined
      try {
        portal = await firstValueFrom(portalApi.getPortalData(config.getProperty(CONFIG_KEY.TKIT_PORTAL_ID) || 'ADMIN'))
      } catch (e) {
        errCause = PORTAL_LOAD_INIT_ERR
        throw e
      }
      console.log(`📃 portal OK? `, portal)
      await appStateService.currentPortal$.publish(portal)

      const standaloneMfeInfo: MfeInfo = {
        mountPath: '/',
        remoteBaseUrl: '.',
        baseHref: '/',
        shellName: 'standalone',
        appId: '',
        productName: '',
      }
      await appStateService.globalLoading$.publish(true)
      await appStateService.currentMfe$.publish(standaloneMfeInfo)
      await appStateService.globalLoading$.publish(false)

      let theme = undefined
      if (!portal) {
        throw new Error('No portal data found')
      } else {
        try {
          if (portal.themeName) {
            theme = await firstValueFrom(themeService.loadAndApplyTheme(portal.themeName))
          }
        } catch (e) {
          errCause = THEME_INIT_ERR
          throw e
        }
      }
      return theme
    } catch (e) {
      console.log('Standalone Initializer')
      console.log(`🛑 Error during initialization: ${errCause} ${e} `)
      console.dir(e)
      await appStateService.globalError$.publish(errCause || 'INITIALIZATION_ERROR')
      return undefined
    } finally {
      // eslint-disable-next-line no-restricted-syntax
      console.timeEnd('initializer')
    }
  }
}
