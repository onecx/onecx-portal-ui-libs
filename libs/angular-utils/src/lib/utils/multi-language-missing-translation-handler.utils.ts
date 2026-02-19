import { APP_ID, inject, Injectable } from '@angular/core'
import {
  getValue,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateParser,
} from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { DynamicTranslationService, UserService } from '@onecx/angular-integration-interface'
import { DynamicAppId } from '@onecx/angular-webcomponents'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'
import { MULTI_LANGUAGE_IDENTIFIER, MultiLanguageIdentifier } from '../injection-tokens/multi-language-identifier'
import deepmerge from 'deepmerge'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  private readonly parser = inject(TranslateParser)
  private readonly dynamicTranslationService = inject(DynamicTranslationService)
  private readonly multiLanguageIdentifier = this.createMultiLanguageIdentifiers()

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
      map((interpolatableTranslationObject: Record<string, any>) => {
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
        return this.dynamicTranslationService.getTranslations(lang, this.multiLanguageIdentifier).pipe(
          map((translationsPerIdentifier) => {
            const values = Object.values(translationsPerIdentifier)
            const translations = values.length > 0 ? deepmerge.all(values) : {}
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

  loadTranslations(langConfig: Observable<string[]>, params: MissingTranslationHandlerParams): Observable<string> {
    return langConfig.pipe(
      mergeMap((l) => {
        const langs = [...l]
        const chain = (o: Observable<string[]>): Observable<any> => {
          return o.pipe(
            mergeMap((lang) => {
              return this.findTranslationForLang(lang[0], params)
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
    const appId = inject(APP_ID, { optional: true }) as any

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
