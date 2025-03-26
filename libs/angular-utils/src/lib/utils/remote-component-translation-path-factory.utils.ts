import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '@onecx/angular-remote-components'

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
