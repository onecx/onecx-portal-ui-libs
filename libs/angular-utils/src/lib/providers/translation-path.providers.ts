import { LOCALE_ID, Provider } from '@angular/core'
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils'
import { UserService } from '@onecx/angular-integration-interface'

export function provideTranslationPaths(): Provider[] {
  return [
    {
      provide: LOCALE_ID,
      useFactory: (userService: UserService) => {
        return userService.lang$.getValue()
      },
      deps: [UserService],
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-angular-utils/assets/i18n/',
      multi: true,
    },
  ]
}
