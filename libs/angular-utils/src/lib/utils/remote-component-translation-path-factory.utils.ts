import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
        remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
      multi: true,
      deps: [REMOTE_COMPONENT_CONFIG]
    }
    to provide the translation path.
 */
export function remoteComponentTranslationPathFactory(path: string) {
  return function TranslationPathFactory(
    remoteComponentConfig: ReplaySubject<RemoteComponentConfig>
  ): Observable<string> {
    return remoteComponentConfig.pipe(
      map((config) => {
        return Location.joinWithSlash(config.baseUrl, path)
      })
    )
  }
}
