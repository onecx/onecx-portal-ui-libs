import { inject, Injector } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { defaultIfEmpty, first, from, isObservable, map, mergeMap, Observable, of, tap, zip } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { TRANSLATION_PATH } from './create-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'
import { CachingTranslateLoader } from './caching-translate-loader.utils'

export class OnecxTranslateLoader implements TranslateLoader {
  static lastTimerId = 0
  timerId = OnecxTranslateLoader.lastTimerId++

  private readonly injector = inject(Injector)
  private readonly translationCacheService = inject(TranslationCacheService)
  private readonly translationPaths = inject(TRANSLATION_PATH, { optional: true }) ?? []
  private readonly translateLoader$: Observable<TranslateLoader | undefined> = zip(
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
    tap(() => console.timeEnd('createTranslateLoader_' + this.timerId))
  )

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      tap(() => console.time('OnecxTranslateLoader_' + this.timerId)),
      defaultIfEmpty(undefined),
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({})),
      tap(() => console.timeEnd('OnecxTranslateLoader_' + this.timerId))
    )
  }

  private toObservable(path: string | Observable<string> | Promise<string>): Observable<string> {
    if (isObservable(path)) {
      return path
    }
    return from(Promise.resolve(path))
  }
}
