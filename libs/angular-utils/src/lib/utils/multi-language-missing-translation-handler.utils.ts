import { APP_ID, inject, Injectable } from '@angular/core'
import {
  getValue,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateParser,
} from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { DynamicTranslationService, UserService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'
import { MULTI_LANGUAGE_IDENTIFIER, MultiLanguageIdentifier } from '../injection-tokens/multi-language-identifier'
import { mergeDeep } from './deep-merge.utils'

type DynamicAppId = { appElementName?: string }

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  private readonly parser = inject(TranslateParser)
  private readonly dynamicTranslationService = inject(DynamicTranslationService)
  private readonly multiLanguageIdentifiers = this.createMultiLanguageIdentifiers()

  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        if (p.settings?.locales) {
          return p.settings.locales
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
    return params.translateService.reloadLang(lang).pipe(
      map((interpolatableTranslationObject: Record<string, unknown>) => {
        const translatedValue = this.parser.interpolate(
          getValue(interpolatableTranslationObject, params.key) as string,
          params.interpolateParams
        )
        if (!translatedValue) {
          throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
        }
        return translatedValue
      }),
      catchError(() => {
        return this.dynamicTranslationService.getTranslations(lang, this.multiLanguageIdentifiers).pipe(
          map((translationsPerIdentifier) => {
            const values = Object.values(translationsPerIdentifier)
            const translations = this.mergeTranslations(values)
            const translatedValue = this.parser.interpolate(
              getValue(translations, params.key) as string,
              params.interpolateParams
            )
            if (!translatedValue) {
              throw new Error(`No dynamic translation found for key: ${params.key} in language: ${lang}`)
            }
            return translatedValue
          })
        )
      })
    )
  }

  private mergeTranslations(values: unknown[]): Record<string, unknown> {
    return values.reduce<Record<string, unknown>>(
      (acc, current) => mergeDeep(acc, (current as Record<string, unknown>) ?? {}),
      {}
    )
  }

  loadTranslations(langConfig: Observable<string[]>, params: MissingTranslationHandlerParams): Observable<string> {
    return langConfig.pipe(
      mergeMap((configuredLanguages) => {
        const langs = [...configuredLanguages]
        const chain = (languages$: Observable<string[]>): Observable<string> => {
          return languages$.pipe(
            mergeMap((currentLanguages) => {
              return this.findTranslationForLang(currentLanguages[0], params)
            }),
            catchError(() => {
              langs.shift()
              if (langs.length === 0) {
                throw new Error(`No translation found for key: ${params.key}`)
              }
              return chain(of(langs))
            })
          )
        }
        return chain(of(langs))
      })
    )
  }

  private createMultiLanguageIdentifiers(): MultiLanguageIdentifier[] {
    const identifiers = inject(MULTI_LANGUAGE_IDENTIFIER, { optional: true }) ?? []
    const hasAppIdentifier = identifiers.some((id) => id.type === 'app')
    const appId = inject(APP_ID, { optional: true }) as DynamicAppId | undefined

    if (!hasAppIdentifier && appId?.appElementName) {
      return [
        ...identifiers,
        {
          name: appId.appElementName,
          type: 'app',
        },
      ]
    }

    return identifiers
  }
}
