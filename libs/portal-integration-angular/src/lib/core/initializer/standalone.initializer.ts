import { firstValueFrom } from 'rxjs'
import { IAuthService } from '../../api/iauth.service'
import { ConfigurationService } from '../../services/configuration.service'
import { PortalApiService } from '../../services/portal-api.service'
import { ThemeService } from '../../services/theme.service'
import { AppStateService } from '../../services/app-state.service'
import { CONFIG_KEY } from '../../model/config-key.model'
import { UserService } from '../../services/user.service'

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
  userService: UserService
): () => Promise<any> {
  // eslint-disable-next-line no-restricted-syntax
  console.time('initializer')
  console.log(`⭐ Standalone initializer for:  ${appName}`)
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
        authOk = await auth.init()
      } catch (e) {
        errCause = AUTH_INIT_ERR
        throw e
      }
      console.log(`📑 auth OK? ${authOk}`)
      try {
        await userService.init()
        await userService.permissions$.isInitialized
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
      console.log(`📃 portal OK? ${portal}`)
      appStateService.currentPortal$.publish(portal)
      await appStateService.currentPortal$.isInitialized
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
      appStateService.globalError$.publish(errCause || 'INITIALIZATION_ERROR')
      return undefined
    } finally {
      // eslint-disable-next-line no-restricted-syntax
      console.timeEnd('initializer')
    }
  }
}
