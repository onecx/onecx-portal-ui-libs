import { combineLatest, filter, map, Observable } from "rxjs"
import { AppStateService } from "@onecx/angular-integration-interface"
import { Location } from "@angular/common"

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... => translationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path. 
 *  Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function translationPathFactory(path: string) {
  return function TranslationPathFactory(appStateService: AppStateService): Observable<string> {
    return combineLatest([
      appStateService.currentMfe$.asObservable(),
      appStateService.globalLoading$.asObservable(),
    ]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        return Location.joinWithSlash(currentMfe.remoteBaseUrl, path)
      })
    )
  }
}
