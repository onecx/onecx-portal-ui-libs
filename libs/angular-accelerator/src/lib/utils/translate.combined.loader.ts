import { TranslateLoader } from '@ngx-translate/core'
import { Observable, catchError, forkJoin, map, of } from 'rxjs'

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
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
          result = this.mergeDeep(result, translations)
        })
        return result
      })
    )
  }
  isObject(item: any): any {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target)
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] })
          else output[key] = this.mergeDeep(target[key], source[key])
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
    return output
  }
}
