import { ModuleFederation } from '@module-federation/enhanced/runtime'
import { Injectable, Injector, inject } from '@angular/core'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Config, EventsTopic, EventType } from '@onecx/integration-interface'
import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory, Injectables } from './auth.service'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import './declarations'
import { DisabledAuthService } from './auth_services/disabled-auth.service'

const CUSTOM_AUTH_REMOTE_ALIAS = 'custom-auth-service'

@Injectable()
export class AuthServiceWrapper {
  private configService = inject(ConfigurationService)
  private appStateService = inject(AppStateService)
  private injector = inject(Injector)

  private eventsTopic$ = new EventsTopic()
  private authService: AuthService | undefined

  constructor() {
    this.eventsTopic$
      .pipe(filter((e) => e.type === EventType.AUTH_LOGOUT_BUTTON_CLICKED))
      .subscribe(() => this.authService?.logout())
    // Shell defines these properties to support older library versions
    window.onecxAngularAuth ??= {}
    window.onecxAngularAuth.authServiceProxy ??= {}
    window.onecxAngularAuth.authServiceProxy.v1 ??= {
      updateTokenIfNeeded: (): Promise<boolean> => {
        return this.updateTokenIfNeeded()
      },
      getHeaderValues: (): Record<string, string> => {
        return this.getHeaderValues()
      },
    }
    window.onecxAuth ??= {}
    window.onecxAuth.authServiceProxy ??= {}
    window.onecxAuth.authServiceProxy.v1 ??= {
      updateTokenIfNeeded: (): Promise<boolean> => {
        return this.updateTokenIfNeeded()
      },
      getHeaderValues: (): Record<string, string> => {
        return this.getHeaderValues()
      },
    }
  }
  async init(): Promise<boolean | undefined> {
    await this.configService.isInitialized

    await this.initializeAuthService()
    const initResult = this.getInitResult()
    return initResult
  }
  async getInitResult(): Promise<boolean | undefined> {
    const initResult = await this.authService?.init()

    if (initResult) {
      await this.appStateService.isAuthenticated$.publish()
    }
    return initResult
  }
  getHeaderValues(): Record<string, string> {
    return this.authService?.getHeaderValues() ?? {}
  }
  updateTokenIfNeeded(): Promise<boolean> {
    return this.authService?.updateTokenIfNeeded() ?? Promise.reject()
  }

  async initializeAuthService(): Promise<void> {
    const serviceTypeConfig = (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE)) ?? 'keycloak'

    switch (serviceTypeConfig) {
      case 'keycloak':
        this.authService = this.injector.get(KeycloakAuthService)
        break
      case 'custom': {
        // remote module is exposing function as default export (this is a convention)
        // this function is responsible for creating the custom auth service
        // to have access to the dependency mechanism of the shell
        // the function gets a callback which is returning the requested injectable
        const factory = await this.getAuthServiceFactory()
        this.authService = await Promise.resolve(
          factory((injectable: Injectables) => this.retrieveInjectables(injectable))
        )
        break
      }
      case 'disabled':
        this.authService = this.injector.get(DisabledAuthService)
        break
      default:
        throw new Error('Configured AuthService not found')
    }
  }

  async retrieveInjectables(injectable: Injectables): Promise<KeycloakAuthService | Config | undefined> {
    if (injectable === Injectables.KEYCLOAK_AUTH_SERVICE) {
      return this.injector.get(KeycloakAuthService)
    } else if (injectable === Injectables.CONFIG) {
      return this.configService.getConfig()
    }
    throw new Error('unknown injectable type')
  }

  async getAuthServiceFactory(): Promise<AuthServiceFactory> {
    if (!(await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL))) {
      throw new Error('URL of the custom auth service is not defined')
    }
    const remoteEntry = (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL)) ?? ''
    const exposedModule =
      (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_MODULE_NAME)) ?? './CustomAuth'
    const sanitizedExposedModule = exposedModule.startsWith('./') ? exposedModule.slice(2) : exposedModule

    const customAuthShareScope = await this.configService.getProperty(CONFIG_KEY.CUSTOM_AUTH_SHARE_SCOPE)
    const shellMfInstance = this.getShellMfInstance()
    if (!shellMfInstance) {
      throw new Error('Shell module federation instance not found')
    }
    shellMfInstance.registerRemotes([
      {
        type: 'module',
        entry: remoteEntry,
        name: CUSTOM_AUTH_REMOTE_ALIAS,
        shareScope: customAuthShareScope,
      },
    ])
    const module = await shellMfInstance.loadRemote<{ default: AuthServiceFactory }>(
      CUSTOM_AUTH_REMOTE_ALIAS + '/' + sanitizedExposedModule
    )

    if (!module) {
      throw new Error('Failed to load custom auth service module')
    }

    return module.default as AuthServiceFactory
  }

  // Temporary solution until its released
  // https://github.com/module-federation/core/blob/6c9d2ee15757be80f0721e1db443b8b526107015/packages/runtime/src/index.ts#L119
  getShellMfInstance(): ModuleFederation | undefined {
    return globalThis.__FEDERATION__.__INSTANCES__.find((instance) => instance.name === 'onecx-shell-ui')
  }
}
