import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { combineLatest, filter, map, tap } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

let lastTranslateLoaderTimerId = 0

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export function createTranslateLoader(
  http: HttpClient,
  appStateService: AppStateService,
  translationCacheService?: TranslationCacheService
): TranslateLoader {
  const ts = translationCacheService ?? inject(TranslationCacheService)
  const timerId = lastTranslateLoaderTimerId++

  console.time('createTranslateLoader_' + timerId)
  return new AsyncTranslateLoader(
    combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        return new TranslateCombinedLoader(
          // translations of shell or of app in standalone mode
          new CachingTranslateLoader(ts, http, `./assets/i18n/`, '.json'),
          // translations of portal-integration-angular of app
          new CachingTranslateLoader(
            ts,
            http,
            Location.joinWithSlash(currentMfe.remoteBaseUrl, `onecx-portal-lib/assets/i18n/`),
            '.json'
          ),
          // translations of portal-integration-angular of shell
          new CachingTranslateLoader(ts, http, `./onecx-portal-lib/assets/i18n/`, '.json'),
          // Primelocale Translations
          new CachingTranslateLoader(
            ts,
            http,
            Location.joinWithSlash(currentMfe.remoteBaseUrl, `onecx-portal-lib/assets/i18n/primeng/`),
            '.json'
          ),
          // translations of the app
          new CachingTranslateLoader(
            ts,
            http,
            Location.joinWithSlash(currentMfe.remoteBaseUrl, `assets/i18n/`),
            '.json'
          )
        )
      }),
      tap(() => console.timeEnd('createTranslateLoader_' + timerId))
    )
  )
}
