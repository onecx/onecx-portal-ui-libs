import { LOCALE_ID, Provider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers'

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
  ]
}