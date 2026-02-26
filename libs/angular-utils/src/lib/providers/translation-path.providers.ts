import { LOCALE_ID, Provider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers'
import { provideMultiLanguageIdentifier } from './multi-language-identifier.provider'
import { LIB_VERSION } from '../../version'

const localProvider = {
  provide: LOCALE_ID,
  useFactory: (userService: UserService) => {
    return userService.lang$.getValue()
  },
  deps: [UserService],
}

export function provideTranslationPaths(): Provider[] {
  return [
    localProvider,
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-utils/assets/i18n/'),
    provideMultiLanguageIdentifier('@onecx/angular-utils', LIB_VERSION, 'lib'),
  ]
}