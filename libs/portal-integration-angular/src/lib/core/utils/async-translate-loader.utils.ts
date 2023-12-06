import { TranslateLoader } from '@ngx-translate/core'
import { first, mergeMap, Observable, tap } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      first(),
      tap((t) => console.log('BEFORE MERGEMAP ', t)),
      mergeMap((translateLoader) => translateLoader.getTranslation(lang)),
      tap((translations) => console.log('AsyncTranslateLoader ', translations))
    )
  }
}
