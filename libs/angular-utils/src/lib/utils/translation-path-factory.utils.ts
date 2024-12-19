import { combineLatest, filter, map, Observable } from "rxjs"
import { AppStateService } from "@onecx/angular-integration-interface"
import { Location } from "@angular/common"

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
