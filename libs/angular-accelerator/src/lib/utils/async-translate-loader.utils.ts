import { TranslateLoader } from '@ngx-translate/core'
import { defaultIfEmpty, first, mergeMap, Observable, of, tap } from 'rxjs'

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export class AsyncTranslateLoader implements TranslateLoader {
  static lastTimerId = 0
  timerId = AsyncTranslateLoader.lastTimerId++

  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      tap(() => console.time('AsyncTranslateLoader_' + this.timerId)),
      defaultIfEmpty(undefined),
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({})),
      tap(() => console.timeEnd('AsyncTranslateLoader_' + this.timerId))
    )
  }
}
