import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

/**
 * @deprecated Use provideTranslationPathFromMeta instead for translation path providers.
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
