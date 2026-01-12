import { inject, Injectable, Injector } from '@angular/core'
import { TranslateLoader, TranslationObject } from '@ngx-translate/core'
import { first, from, isObservable, map, mergeMap, Observable, of, shareReplay, zip } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { TRANSLATION_PATH } from '../injection-tokens/translation-path'
import { TranslateCombinedLoader } from './translate.combined.loader'
import { CachingTranslateLoader } from './caching-translate-loader.utils'

@Injectable()
export class OnecxTranslateLoader implements TranslateLoader {
  static lastTimerId = 0
  timerId = OnecxTranslateLoader.lastTimerId++

  private readonly translationCacheService = inject(TranslationCacheService)
  private readonly injector = inject(Injector)
  private readonly translationPaths = inject(TRANSLATION_PATH, { optional: true }) ?? []
  private readonly translateLoader$: Observable<TranslateLoader> = zip(
    this.translationPaths.map((value) => this.toObservable(value))
  ).pipe(
    map((translationPaths) => {
      const uniqueTranslationPaths = [...new Set(translationPaths)]
      return new TranslateCombinedLoader(
        ...uniqueTranslationPaths.map((path) => {
          return new CachingTranslateLoader(this.translationCacheService, this.injector, path, '.json')
        })
      )
    }),
    shareReplay(1)
  )

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.translateLoader$.pipe(
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({}))
    )
  }

  private toObservable(path: string | Observable<string> | Promise<string>): Observable<string> {
    if (isObservable(path)) {
      return path
    }
    return from(Promise.resolve(path))
  }
}
