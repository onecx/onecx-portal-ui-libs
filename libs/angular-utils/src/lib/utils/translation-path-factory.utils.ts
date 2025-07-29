import { combineLatest, filter, map, Observable } from "rxjs"
import { AppStateService } from "@onecx/angular-integration-interface"
import { Location } from "@angular/common"

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: (appStateService: AppStateService) => translationPathFactory('assets/i18n/')(appStateService),
      multi: true,
      deps: [AppStateService]
    }
    to provide the translation path.
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
