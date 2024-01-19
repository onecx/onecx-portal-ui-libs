import { TranslateLoader } from '@ngx-translate/core'
import { first, mergeMap, Observable } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      first(),
      mergeMap((translateLoader) => translateLoader.getTranslation(lang))
    )
  }
}
