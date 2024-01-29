import { TranslateLoader } from '@ngx-translate/core'
import { first, mergeMap, Observable, tap } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      tap(() => console.time('AsyncTranslateLoader')),
      first(),
      mergeMap((translateLoader) => translateLoader.getTranslation(lang)),
      tap(() => console.timeEnd('AsyncTranslateLoader'))
    )
  }
}
