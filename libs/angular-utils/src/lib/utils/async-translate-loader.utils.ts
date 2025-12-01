import { TranslateLoader } from '@ngx-translate/core'
import { defaultIfEmpty, first, mergeMap, Observable, of } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private readonly translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      defaultIfEmpty(undefined),
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({})),
    )
  }
}
