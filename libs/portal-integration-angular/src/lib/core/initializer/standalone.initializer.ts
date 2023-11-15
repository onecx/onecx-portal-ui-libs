import { firstValueFrom, of } from 'rxjs'
import { IAuthService } from '../../api/iauth.service'
import { ConfigurationService } from '../../services/configuration.service'
import { PortalApiService } from '../../services/portal-api.service'
import { ThemeService } from '../../services/theme.service'
import { AppStateService } from '../../services/app-state.service'

const CONFIG_INIT_ERR = 'CONFIG_INIT_ERR'
const AUTH_INIT_ERR = 'AUTH_INIT_ERR'
const THEME_INIT_ERR = 'THEME_INIT_ERR'
const PORTAL_LOAD_INIT_ERR = 'PORTAL_LOAD_INIT_ERR'

export function standaloneInitializer(
  auth: IAuthService,
  config: ConfigurationService,
  portalApi: PortalApiService,
  themeService: ThemeService,
  appName: string,
  initState: AppStateService
): () => Promise<any> {
  // eslint-disable-next-line no-restricted-syntax
  console.time('initializer')
  console.log(`⭐ Standalone initializer for:  ${appName}`)
  let errCause: string
  return () =>
    config
      .init()
      .catch((e) => {
        errCause = CONFIG_INIT_ERR
        throw e
      })
      .then((configOk) => {
        console.log(`📑 config OK? ${configOk}`)
        return auth.init().catch((e) => {
          errCause = AUTH_INIT_ERR
          throw e
        })
      })
      .then((authOk) => {
        console.log(`👮‍♀️ auth OK? ${authOk}`)

        return firstValueFrom(portalApi.getPortalData(config.getPortalId() || 'ADMIN'))
          .then((portal) => {
            config.setPortal(portal)
            return portal
          })
          .catch((e) => {
            errCause = PORTAL_LOAD_INIT_ERR
            throw e
          })
      })
      .then((portal) => {
        console.log(`📃 portal OK? ${portal}`)
        if (!portal) {
          throw new Error('No portal data found')
        } else {
          if (portal.themeName) {
            return firstValueFrom(themeService.loadAndApplyTheme(portal.themeName)).catch((e) => {
              errCause = THEME_INIT_ERR
              throw e
            })
          }
        }
        return null
      })

      .catch((err) => {
        console.log('Standalone Initializer')
        console.log(`🛑 Error during initialization: ${errCause} ${err} `)
        console.dir(err)
        initState.globalErrorTopic$.publish(errCause || 'INITIALIZATION_ERROR')
        //TODO store error info somewhere, so we can show error in app component
        return of(null)
      })
      .finally(() => {
        // eslint-disable-next-line no-restricted-syntax
        console.timeEnd('initializer')
      })
}
