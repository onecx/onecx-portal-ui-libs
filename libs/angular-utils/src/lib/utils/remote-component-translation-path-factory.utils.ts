import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... =>
        remoteComponentTranslationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path.
    Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
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
