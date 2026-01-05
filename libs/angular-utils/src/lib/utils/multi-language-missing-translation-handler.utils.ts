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

    return loadTranslations(locales$, params, this.parser)
  }
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
function findTranslationForLang(
  lang: string,
  params: MissingTranslationHandlerParams,
  parser: TranslateParser
): Observable<string> {
  return params.translateService.reloadLang(lang).pipe(
    map((interpolatableTranslationObject: Record<string, any>) => {
      const translatedValue = parser.interpolate(
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

function loadTranslations(
  langConfig: Observable<string[]>,
  params: MissingTranslationHandlerParams,
  parser: TranslateParser
): Observable<string> {
  return langConfig.pipe(
    mergeMap((l) => {
      const langs = [...l]
      const chain = (o: Observable<string[]>): Observable<any> => {
        return o.pipe(
          mergeMap((lang) => {
            return findTranslationForLang(lang[0], params, parser)
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
