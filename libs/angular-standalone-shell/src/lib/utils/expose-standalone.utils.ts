import { APP_INITIALIZER, InjectionToken } from '@angular/core'

import {
  AppStateService,
  ConfigurationService,
  MfeInfo,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { initializeRouter } from '@onecx/angular-webcomponents'
import { Router } from '@angular/router'
import { PermissionsTopic, Theme, UserProfile, Workspace } from '@onecx/integration-interface'
import { provideAlwaysGrantPermissionChecker, provideMultiLanguageIdentifier, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { provideTokenInterceptor } from '@onecx/angular-auth'
import { provideAuthService } from '@onecx/shell-auth'
import { MessageService } from 'primeng/api'
import { createLogger } from './logger.utils'
import { LIB_VERSION } from '../../version'

const logger = createLogger('expose-standalone')

async function apply(themeService: ThemeService, theme: Theme): Promise<void> {
  logger.info(`Applying theme: ${theme.name}`)
  await themeService.currentTheme$.publish(theme)
  if (theme.properties) {
    Object.values(theme.properties).forEach((group) => {
      for (const [key, value] of Object.entries(group)) {
        document.documentElement.style.setProperty(`--${key}`, value)
      }
    })
  }
}

const appInitializer = (
  appStateService: AppStateService,
  userService: UserService,
  configService: ConfigurationService,
  themeService: ThemeService,
  providerConfig?: Partial<ProvideStandaloneProvidersConfig>
) => {
  return async () => {
    const standaloneMfeInfo: MfeInfo = {
      mountPath: '/',
      remoteBaseUrl: '.',
      baseHref: '/',
      shellName: 'standalone',
      appId: '',
      productName: '',
      ...(providerConfig?.mfeInfo ?? {}),
    }
    await appStateService.globalLoading$.publish(true)
    await appStateService.currentMfe$.publish(standaloneMfeInfo)
    await appStateService.globalLoading$.publish(false)
    await configService.init()
    await userService.profile$.publish({
      person: {},
      userId: 'standaloneMockUser',
      accountSettings: {
        localeAndTimeSettings: {
          locale: 'en',
          ...(providerConfig?.userProfile?.accountSettings?.localeAndTimeSettings ?? {}),
        },
        layoutAndThemeSettings: {
          menuMode: 'HORIZONTAL',
          colorScheme: 'AUTO',
          ...(providerConfig?.userProfile?.accountSettings?.layoutAndThemeSettings ?? {}),
        },
        ...(providerConfig?.userProfile?.accountSettings ?? {}),
      },
      ...(providerConfig?.userProfile ?? {}),
    })
    const permissionsTopic = new PermissionsTopic()
    await permissionsTopic.publish(providerConfig?.permissions ?? [])
    permissionsTopic.destroy()
    await appStateService.currentWorkspace$.publish({
      workspaceName: 'Standalone',
      baseUrl: '/',
      portalName: 'Standalone',
      microfrontendRegistrations: [],
      ...(providerConfig?.workspace ?? {}),
    })
    await apply(themeService, {
      ...(providerConfig?.theme ?? {}),
    })
  }
}

export interface ProvideStandaloneProvidersConfig {
  workspace: Partial<Workspace>
  userProfile: Partial<UserProfile>
  mfeInfo: Partial<MfeInfo>
  theme: Partial<Theme>
  permissions?: string[]
}

export const PROVIDE_STANDALONE_PROVIDERS_CONFIG = new InjectionToken<ProvideStandaloneProvidersConfig>(
  'provideStandaloneProvidersConfig'
)

export function provideStandaloneProviders(config?: Partial<ProvideStandaloneProvidersConfig>) {
  return [
    {
      provide: PROVIDE_STANDALONE_PROVIDERS_CONFIG,
      useValue: config,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AppStateService, UserService, ConfigurationService, ThemeService, PROVIDE_STANDALONE_PROVIDERS_CONFIG],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService],
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideMultiLanguageIdentifier('@onecx/angular-standalone-shell', LIB_VERSION, 'lib'),
    provideAlwaysGrantPermissionChecker(),
    provideTokenInterceptor(),
    provideAuthService(),
    MessageService,
  ]
}
