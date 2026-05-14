import { inject, Injectable } from '@angular/core'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateParser } from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { defer, Observable, of, throwError } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  private readonly parser = inject(TranslateParser)

  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        if (p.settings?.locales) {
          return p.settings?.locales
        }
        return getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    return this.loadTranslations(locales$, params).pipe(
      catchError((err: Error) => {
        console.log('No translation found for key: %s. %O', params.key, err)
        return of(params.key)
      })
    )
  }

  findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    return defer<string>(() => {
      const storedTranslations = this.getStoredTranslations(params.translateService, lang)
      const translatedFromStore = this.tryGetTranslation(storedTranslations, params)
      if (typeof translatedFromStore !== 'undefined') {
        return of(translatedFromStore)
      }

      const shouldTryLoader = !storedTranslations || Object.keys(storedTranslations).length === 0
      if (shouldTryLoader) {
        const loader = (params.translateService as any).currentLoader
        if (!loader?.getTranslation) {
          return throwError(() => new Error('No translation loader configured'))
        }

        return loader.getTranslation(lang).pipe(
          map((rawTranslations: Record<string, unknown>) => {
            const translatedFromLoader = this.tryGetTranslation(rawTranslations, params)
            if (typeof translatedFromLoader === 'undefined') {
              throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
            }
            return translatedFromLoader
          })
        )
      }

      return throwError(() => new Error(`No translation found for key: ${params.key} in language: ${lang}`))
    })
  }

  private getStoredTranslations(translateService: MissingTranslationHandlerParams['translateService'], lang: string) {
    const store = (translateService as unknown as { store?: { getTranslations?: (l: string) => Record<string, unknown> } }).store
    return store?.getTranslations?.(lang)
  }

  private getRawValue(translations: Record<string, unknown>, params: MissingTranslationHandlerParams): unknown {
    const tsParser = (params.translateService as any)?.parser
    if (tsParser?.getValue) {
      return tsParser.getValue(translations, params.key)
    }

    // Fallback for tests/edge cases: support both flat keys ('a.b') and dotted access
    if (Object.prototype.hasOwnProperty.call(translations, params.key)) {
      return (translations as any)[params.key]
    }

    return params.key.split('.').reduce<any>((acc, part) => (acc == null ? acc : acc[part]), translations as any)
  }

  private tryGetTranslation(
    translations: Record<string, unknown> | undefined,
    params: MissingTranslationHandlerParams
  ): string | undefined {
    if (!translations) return undefined
    const rawValue = this.getRawValue(translations, params)
    if (rawValue === undefined || rawValue === null) return undefined
    return this.parser.interpolate(rawValue as any, params.interpolateParams) as any
  }

  loadTranslations(langConfig: Observable<string[]>, params: MissingTranslationHandlerParams): Observable<string> {
    return langConfig.pipe(
      mergeMap((locales) => {
        const langs = [...locales]

        const tryNext = (): Observable<string> => {
          const nextLang = langs.shift()
          if (!nextLang) {
            return throwError(() => new Error(`No translation found for key: ${params.key}`))
          }

          return this.findTranslationForLang(nextLang, params).pipe(catchError(() => tryNext()))
        }

        return tryNext()
      })
    )
  }
}
