import { TranslateLoader } from '@ngx-translate/core'
import { Observable, catchError, forkJoin, map, of } from 'rxjs'
import { mergeDeep } from './deep-merge.utils'
export class TranslateCombinedLoader implements TranslateLoader {
  private _loaders: TranslateLoader[]
  constructor(...loaders: TranslateLoader[]) {
    this._loaders = loaders
  }
  getTranslation(lang: string): Observable<object> {
    return forkJoin(
      this._loaders.map((l) =>
        l.getTranslation(lang).pipe(
          catchError(err => {
            console.error('Failed to load translation file', l, err)
            return of({})
          })
        )
      )
    ).pipe(
      map((allTranslations) => {
        let result = {}
        allTranslations.forEach((translations) => {
          result = mergeDeep(result, translations)
        })
        return result
      })
    )
  }
}
