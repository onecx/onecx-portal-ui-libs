import { TranslateLoader } from '@ngx-translate/core'
import { first, mergeMap, Observable, tap } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  static lastTimerId = 0
  timerId = AsyncTranslateLoader.lastTimerId++

  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      tap(() => console.time('AsyncTranslateLoader_' + this.timerId)),
      first(),
      mergeMap((translateLoader) => translateLoader.getTranslation(lang)),
      tap(() => console.timeEnd('AsyncTranslateLoader_' + this.timerId))
    )
  }
}
