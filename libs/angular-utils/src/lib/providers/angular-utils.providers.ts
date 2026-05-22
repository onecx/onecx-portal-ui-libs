import { inject, LOCALE_ID, Provider, provideAppInitializer, EnvironmentProviders } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPaths } from './translation-path.providers'
import { UserService } from '@onecx/angular-integration-interface'
import { DynamicLocaleId } from '../utils/dynamic-locale-id.utils'
import { localeLoaders } from '../utils/angular-locales'
import { registerLocaleData } from '@angular/common'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderConfig {
  contentType: ContentType
}

export function provideAngularUtils(): (Provider | EnvironmentProviders)[] {
  const providers = [
    ...providePermissionService(), 
    provideTranslationPaths(),
    {
      provide: LOCALE_ID, 
      useClass: DynamicLocaleId,
      deps: [UserService],
    },
    provideAppInitializer(async () => {
      const userService = inject(UserService);
      const lang = userService.lang$.getValue();
      try {
        await localeLoaders[lang]?.().then(data => registerLocaleData(data.default ?? data))
      } catch (error) {
        console.warn(`Could not load locale data for '${lang}'. Angular pipes may not format correctly.`, error)
      }
    })
  ]
  return providers
}
