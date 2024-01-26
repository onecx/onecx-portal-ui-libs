import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { combineLatest, filter, map } from 'rxjs'
import { AppStateService } from '../../services/app-state.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

export function createTranslateLoader(http: HttpClient, appStateService: AppStateService): TranslateLoader {
  return new AsyncTranslateLoader(
    combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        return new TranslateCombinedLoader(
          // translations of shell or of app in standalone mode
          new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
          // translations of portal-integration-angular of app
          new TranslateHttpLoader(
            http,
            Location.joinWithSlash(currentMfe.remoteBaseUrl, `onecx-portal-lib/assets/i18n/`),
            '.json'
          ),
          // translations of the app
          new TranslateHttpLoader(http, Location.joinWithSlash(currentMfe.remoteBaseUrl, `assets/i18n/`), '.json')
        )
      })
    )
  )
}
