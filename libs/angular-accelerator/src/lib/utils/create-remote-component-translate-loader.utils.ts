import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { map, ReplaySubject, tap } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

let lastTranslateLoaderTimerId = 0

export function createRemoteComponentTranslateLoader(
  http: HttpClient,
  baseUrlReplaySubject$: ReplaySubject<string>,
  translationCacheService?: TranslationCacheService
): TranslateLoader {
  const ts = translationCacheService ?? inject(TranslationCacheService)
  const timerId = lastTranslateLoaderTimerId++

  console.time('createRemoteComponentTranslateLoader_' + timerId)
  return new AsyncTranslateLoader(
    baseUrlReplaySubject$.pipe(
      map((baseUrl) => {
        return new TranslateCombinedLoader(
          // translations of shell or of app in standalone mode
          new CachingTranslateLoader(ts, http, `./assets/i18n/`, '.json'),
          // translations of portal-integration-angular of app
          new CachingTranslateLoader(
            ts,
            http,
            Location.joinWithSlash(baseUrl, `onecx-portal-lib/assets/i18n/`),
            '.json'
          ),
          // translations of portal-integration-angular of shell
          new CachingTranslateLoader(ts, http, `./onecx-portal-lib/assets/i18n/`, '.json'),
          // translations of the app
          new CachingTranslateLoader(ts, http, Location.joinWithSlash(baseUrl, `assets/i18n/`), '.json')
        )
      }),
      tap(() => console.timeEnd('createRemoteComponentTranslateLoader_' + timerId))
    )
  )
}
