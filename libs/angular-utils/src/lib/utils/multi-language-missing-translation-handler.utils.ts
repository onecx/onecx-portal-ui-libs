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
    return defer((): Observable<string> => {
      const storedTranslations = this.getStoredTranslations(params.translateService, lang)
      const translatedFromStore = this.tryGetTranslation(storedTranslations, params)
      if (translatedFromStore !== undefined) {
        return of(translatedFromStore)
      }

      const shouldTryLoader = !storedTranslations || Object.keys(storedTranslations).length === 0
      if (shouldTryLoader) {
        const currentLoader = (params.translateService as unknown as { currentLoader?: unknown }).currentLoader
        const getTranslation = (currentLoader as { getTranslation?: unknown } | undefined)?.getTranslation
        if (typeof getTranslation !== 'function') {
          return throwError(() => new Error('No translation loader configured'))
        }

        return (getTranslation as (l: string) => Observable<Record<string, unknown>>)(lang).pipe(
          map((rawTranslations: Record<string, unknown>) => {
            const translatedFromLoader = this.tryGetTranslation(rawTranslations, params)
            if (translatedFromLoader === undefined) {
              throw new TypeError(`No translation found for key: ${params.key} in language: ${lang}`)
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
    const parser = (params.translateService as unknown as { parser?: unknown }).parser
    const getValue = (parser as { getValue?: unknown } | undefined)?.getValue
    if (typeof getValue === 'function') {
      return (getValue as (t: Record<string, unknown>, k: string) => unknown)(translations, params.key)
    }

    // Fallback for tests/edge cases: support both flat keys ('a.b') and dotted access
    if (Object.hasOwn(translations, params.key)) {
      return translations[params.key]
    }

    let current: unknown = translations
    for (const part of params.key.split('.')) {
      if (typeof current !== 'object' || current === null) return undefined
      current = (current as Record<string, unknown>)[part]
    }
    return current
  }

  private tryGetTranslation(
    translations: Record<string, unknown> | undefined,
    params: MissingTranslationHandlerParams
  ): string | undefined {
    if (!translations) return undefined
    const rawValue = this.getRawValue(translations, params)
    if (rawValue === undefined || rawValue === null) return undefined
    type InterpolateExpr = Parameters<TranslateParser['interpolate']>[0]

    let interpolateValue: InterpolateExpr
    if (typeof rawValue === 'function') {
      interpolateValue = rawValue as InterpolateExpr
    } else if (typeof rawValue === 'string') {
      interpolateValue = rawValue
    } else if (typeof rawValue === 'number' || typeof rawValue === 'boolean' || typeof rawValue === 'bigint') {
      interpolateValue = `${rawValue}`
    } else if (rawValue instanceof Date) {
      interpolateValue = rawValue.toISOString()
    } else {
      try {
        const json = JSON.stringify(rawValue)
        if (typeof json !== 'string') return undefined
        interpolateValue = json
      } catch {
        return undefined
      }
    }

    return this.parser.interpolate(interpolateValue, params.interpolateParams)
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
