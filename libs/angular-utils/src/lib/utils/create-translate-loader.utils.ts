import { HttpClient } from '@angular/common/http'
import { inject, InjectionToken } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { from, isObservable, map, Observable, tap, zip } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

let lastTranslateLoaderTimerId = 0

export const TRANSLATION_PATH = new InjectionToken<(string | Observable<string> | Promise<string>)[]>(
  'TRANSLATION_PATH'
)

function toObservable(path: string | Observable<string> | Promise<string>): Observable<string> {
  if (isObservable(path)) {
    return path
  }
  return from(Promise.resolve(path))
}

export function createTranslateLoader(
  http: HttpClient,
  _appStateService?: AppStateService,
  translationCacheService?: TranslationCacheService
): TranslateLoader {
  const ts = translationCacheService ?? inject(TranslationCacheService)
  const timerId = lastTranslateLoaderTimerId++

  const translationPaths = inject(TRANSLATION_PATH, {optional: true}) ?? []

  console.time('createTranslateLoader_' + timerId)
  return new AsyncTranslateLoader(
    zip(translationPaths.map((value) => toObservable(value))).pipe(
      map((translationPaths) => {
        const uniqueTranslationPaths = [...new Set(translationPaths)]
        return new TranslateCombinedLoader(
          ...uniqueTranslationPaths.map((path) => {
            return new CachingTranslateLoader(ts, http, path, '.json')
          })
        )
      }),
      tap(() => console.timeEnd('createTranslateLoader_' + timerId))
    )
  )
}
