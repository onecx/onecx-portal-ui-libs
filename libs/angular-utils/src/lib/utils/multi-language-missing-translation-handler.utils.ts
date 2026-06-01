import { inject, Injectable } from '@angular/core'
import {
  MissingTranslationHandler,
  getValue,
  MissingTranslationHandlerParams,
  TranslateNoOpLoader,
  TranslateParser,
} from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { EMPTY, Observable, from, of } from 'rxjs'
import { catchError, concatMap, map, shareReplay, take, throwIfEmpty } from 'rxjs/operators'

/** Represents one language table loaded from ngx-translate. */
type TranslationTable = Record<string, unknown>

/** Matches the value shapes accepted by `TranslateParser.interpolate`. */
type InterpolatableValue = Parameters<TranslateParser['interpolate']>[0]

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly parser = inject(TranslateParser)
  private readonly userService = inject(UserService)

  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        return p.settings?.locales ?? getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    console.debug(
      '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
      params.key,
      'in language: ',
      params.translateService.currentLang,
      '. Trying to resolve with fallback languages...'
    )
    return locales$.pipe(
      concatMap((locales) => this.loadTranslations(locales, params)),
      catchError((err: Error) => {
        console.warn('[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O', params.key, err)
        return of(params.key)
      })
    )
  }

  /**
   * Tries to resolve the requested key for one language using the ngx-translate loader.
   *
   * @param lang The language code that should be checked.
   * @param params The ngx-translate missing-translation context containing the key and service.
   * @returns An observable that emits the resolved translation string for the language.
   */
  findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    // `currentLoader.getTranslation(lang)` is the low-level ngx-translate API that fetches
    // one language table without changing the active language or resetting cached tables.
    // Intentionally used directly instead of `reloadLang()`, because `reloadLang()` resets
    // the whole language table and emits lang-change events.
    const loader = params.translateService.currentLoader

    // if the loader was not configured, we can't do anything about missing translations, so just log a warning and return the key as fallback
    // loader cannot be null or undefined because ngx-translate falls back to `TranslateNoOpLoader` when no loader is configured
    if (loader instanceof TranslateNoOpLoader) {
      console.warn('[MultiLanguageMissingTranslationHandler] No translation loader configured')
    }

    return loader.getTranslation(lang).pipe(
      concatMap((translations: TranslationTable) => {
        const translatedValue = this.requireTranslation(translations, params, lang)
        return translatedValue === undefined ? EMPTY : of(translatedValue)
      })
    )
  }

  /**
   * Ensures that a loaded translation table contains a usable value for the requested key.
   *
   * @param translations The translation table returned from the ngx-translate loader.
   * @param params The ngx-translate missing-translation context containing the requested key.
   * @param lang The language code currently being resolved.
   * @returns The resolved translation string.
   */
  private requireTranslation(
    translations: TranslationTable,
    params: MissingTranslationHandlerParams,
    lang: string
  ): string | undefined {
    const rawValue = getValue(translations, params.key)
    const interpolateValue = this.toInterpolatableValue(rawValue)
    const translatedValue =
      interpolateValue === undefined ? undefined : this.parser.interpolate(interpolateValue, params.interpolateParams)

    if (translatedValue !== undefined) {
      return translatedValue
    }

    console.warn(
      `[MultiLanguageMissingTranslationHandler] No translation found for key: ${params.key} in language: ${lang}`
    )
    return undefined
  }

  /**
   * Converts raw translation values into forms accepted by ngx-translate interpolation.
   *
   * `TranslateParser.interpolate(...)` accepts strings and functions. This helper also
   * stringifies primitive scalar values so fallback tables can still return readable text.
   *
   * The value stays typed as `unknown` because translation tables and
   * `TranslateParser.getValue()` may return any runtime shape: strings, functions,
   * numbers, booleans, objects, arrays, `null`, or `undefined`.
   * Only the supported scalar/function cases are converted for interpolation.
   *
   * @param rawValue The raw value read from the translation table.
   * @returns A value accepted by `TranslateParser.interpolate`, or `undefined` when unsupported.
   */
  private toInterpolatableValue(rawValue: unknown): InterpolatableValue | undefined {
    switch (typeof rawValue) {
      case 'function':
      case 'string':
        return rawValue as InterpolatableValue
      case 'number':
      case 'boolean':
      case 'bigint':
        return `${rawValue}`
      default:
        return undefined
    }
  }

  /**
   * Tries configured locales in order and emits the first matching translation.
   *
   * @param locales The ordered list of candidate locales to check.
   * @param params The ngx-translate missing-translation context for the requested key.
   * @returns An observable that emits the first resolved translation or fails when none is found.
   */
  private loadTranslations(locales: string[], params: MissingTranslationHandlerParams): Observable<string> {
    return from(locales).pipe(
      concatMap((lang) => this.findTranslationForLang(lang, params).pipe(catchError(() => EMPTY))),
      take(1),
      throwIfEmpty(() => new Error(`No translation found for key: ${params.key}`))
    )
  }
}
