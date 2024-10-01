import { HttpClient } from '@angular/common/http'
import { ReplaySubject, map } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AppStateService } from '@onecx/angular-integration-interface'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'
import { createRemoteComponentTranslateLoader } from './create-remote-component-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { Location } from '@angular/common'

export function createRemoteComponentTranslateLoaderWithMfe(
  httpClient: HttpClient,
  baseUrl: ReplaySubject<string>,
  translationCacheService: TranslationCacheService,
  appStateService: AppStateService
) {
  return new AsyncTranslateLoader(
    appStateService.currentMfe$.pipe(
      map((currentMfe) => {
        return new TranslateCombinedLoader(
          createRemoteComponentTranslateLoader(httpClient, baseUrl, translationCacheService),
          new CachingTranslateLoader(
            translationCacheService,
            httpClient,
            Location.joinWithSlash(currentMfe.remoteBaseUrl, 'assets/i18n/'),
            '.json'
          )
        )
      })
    )
  )
}
