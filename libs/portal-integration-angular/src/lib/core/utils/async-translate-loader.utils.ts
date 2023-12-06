import { TranslateLoader } from '@ngx-translate/core'
import { mergeMap, Observable, tap } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      mergeMap((translateLoader) => translateLoader.getTranslation(lang)),
      tap((translations) => console.log('AsyncTranslateLoader ', translations))
    )
  }
}