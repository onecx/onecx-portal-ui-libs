import { LOCALE_ID, Provider } from '@angular/core'
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { translationPathFactory } from '../utils/translation-path-factory.utils'
import { REMOTE_COMPONENT_CONFIG } from '../model/injection-tokens'
import { ReplaySubject } from 'rxjs'
import { RemoteComponentConfig } from '../model/remote-component-config.model'
import { remoteComponentTranslationPathFactory } from '../utils/remote-component-translation-path-factory.utils'
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