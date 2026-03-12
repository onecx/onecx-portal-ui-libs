import { inject, Injectable } from '@angular/core'
import {
  getValue,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateParser,
} from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  private readonly parser = inject(TranslateParser)

  private readonly reloadedLangs$ = new Map<string, Observable<Record<string, any>>>()
  private readonly loggedMissingKeys = new Set<string>()

  //fixes endless loop of reloadLang calls for missing translations by caching the reloadLang calls for each language
  private reloadLangOnce(lang: string, params: MissingTranslationHandlerParams): Observable<Record<string, any>> {
    const cached = this.reloadedLangs$.get(lang)
    if (cached) {
      return cached
    }

    const reload$ = params.translateService.reloadLang(lang).pipe(
      catchError(() => of({} as Record<string, any>)),
      shareReplay(1)
    )
    this.reloadedLangs$.set(lang, reload$)
    return reload$
  }

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

    return this.loadTranslations(locales$, params)
  }

  /**
   * Tries to find a translation for the given language.
   * If no translation is found, an error is thrown.
   *
   * Uses the translateService to reload the language and get the translation for the given key. Then parses the translation with provided parameters.
   * @param lang - language to find the translation for
   * @param params - parameters containing the key and translateService
   * @returns Observable that emits the translation or throws an error if not found
   */
  findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    return this.reloadLangOnce(lang, params).pipe(
      map((interpolatableTranslationObject: Record<string, any>) => {
        const translatedValue = this.parser.interpolate(
          getValue(interpolatableTranslationObject, params.key) as string,
          params.interpolateParams
        )
        if (!translatedValue) {
          throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
        }
        return translatedValue
      })
    )
  }

  loadTranslations(langConfig: Observable<string[]>, params: MissingTranslationHandlerParams): Observable<string> {
    return langConfig.pipe(
      mergeMap((l) => {
        const langs = Array.isArray(l) ? [...l] : []

        // If no locales are configured, return the key as translation.
        if (langs.length === 0) {
          return of(params.key)
        }
        const chain = (o: Observable<string[]>): Observable<any> => {
          return o.pipe(
            mergeMap((lang) => {
              return this.findTranslationForLang(lang[0], params)
            }),
            catchError(() => {
              langs.shift()
              if (langs.length === 0) {
                if (!this.loggedMissingKeys.has(params.key)) {
                  this.loggedMissingKeys.add(params.key)
                  console.error(`No translation found for key: ${params.key}`)
                }
                return of(params.key)
              }
              return chain(of(langs))
            })
          )
        }
        return chain(of(langs))
      })
    )
  }
}
