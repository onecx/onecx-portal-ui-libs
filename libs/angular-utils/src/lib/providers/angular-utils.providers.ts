import { inject, LOCALE_ID, Provider, provideAppInitializer, EnvironmentProviders} from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPaths } from './translation-path.providers'
import { UserService } from '@onecx/angular-integration-interface'
import { DynamicLocaleId } from '../utils/dynamic-locale-id.utils'
import { firstValueFrom } from 'rxjs'
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
      const locales = await firstValueFrom(userService.profile$).then(profile => profile.settings?.locales ?? [])
      await Promise.all(locales.map(locale => import(`@angular/common/locales/${locale}`).then(data => registerLocaleData(data))
      .catch(() => console.warn(`Could not load locale data for '${locale}'. Angular pipes may not format correctly.`))))
    })
  ]
  return providers
}
