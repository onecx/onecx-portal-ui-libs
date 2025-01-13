import { APP_INITIALIZER, InjectionToken } from "@angular/core";

import { AppStateService, ConfigurationService, MfeInfo, ThemeService, UserService } from '@onecx/angular-integration-interface'
import { TranslateService } from '@ngx-translate/core'
import { firstValueFrom } from 'rxjs'
import { initializeRouter } from '@onecx/angular-webcomponents'
import { Router } from '@angular/router'
import { Theme, UserProfile, Workspace } from "@onecx/integration-interface";
import { provideAlwaysGrantPermissionChecker, TRANSLATION_PATH } from "@onecx/angular-utils";

const appInitializer = (
  appStateService: AppStateService,
  translateService: TranslateService,
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
      ...(providerConfig?.mfeInfo ?? {})
    }
    await appStateService.globalLoading$.publish(true)
    await appStateService.currentMfe$.publish(standaloneMfeInfo)
    await appStateService.globalLoading$.publish(false)
    await firstValueFrom(translateService.use('en'))
    await configService.init()
    await userService.profile$.publish({
      person: {},
      userId: 'standaloneMockUser',
      accountSettings: {
        localeAndTimeSettings: {
          locale: 'en',
          ...(providerConfig?.userProfile?.accountSettings?.localeAndTimeSettings ?? {})  
        },
        layoutAndThemeSettings: {
          menuMode: 'HORIZONTAL',
          "colorScheme": "AUTO",
          ...(providerConfig?.userProfile?.accountSettings?.layoutAndThemeSettings ?? {})  
        },
        ...(providerConfig?.userProfile?.accountSettings ?? {})
      },
      memberships: [],
      ...(providerConfig?.userProfile ?? {})
    })
    await appStateService.currentWorkspace$.publish({
      workspaceName: 'Standalone',
      baseUrl: '/',
      portalName: 'Standalone',
      microfrontendRegistrations: [],
      ...(providerConfig?.workspace ?? {})
    })
    await themeService.apply({
      ...(providerConfig?.theme ?? {})
    })
  }
}

export interface ProvideStandaloneProvidersConfig {
  workspace: Partial<Workspace>,
  userProfile: Partial<UserProfile>,
  mfeInfo: Partial<MfeInfo>;
  theme: Partial<Theme>
}

export const PROVIDE_STANDALONE_PROVIDERS_CONFIG = new InjectionToken<ProvideStandaloneProvidersConfig>('provideStandaloneProvidersConfig')

export function provideStandaloneProviders(config?: Partial<ProvideStandaloneProvidersConfig>) {
  return [
    {
      provide: PROVIDE_STANDALONE_PROVIDERS_CONFIG,
      useValue: config
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AppStateService, TranslateService, UserService, ConfigurationService, ThemeService, PROVIDE_STANDALONE_PROVIDERS_CONFIG]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService]
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './assets/i18n/',
      multi: true,
    },
    provideAlwaysGrantPermissionChecker()
  ]
}