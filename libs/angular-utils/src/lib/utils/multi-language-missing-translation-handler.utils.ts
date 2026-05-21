import { inject, Injectable } from '@angular/core'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateParser } from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { EMPTY, Observable, from, of, throwError } from 'rxjs'
import { catchError, concatMap, map, shareReplay, take, throwIfEmpty } from 'rxjs/operators'

/** Represents one language table loaded from ngx-translate. */
type TranslationTable = Record<string, unknown>

/** Matches the value shapes accepted by `TranslateParser.interpolate`. */
type InterpolatableValue = Parameters<TranslateParser['interpolate']>[0]

/** Minimal parser surface this handler relies on from ngx-translate. */
type TranslateParserView = Pick<TranslateParser, 'getValue' | 'interpolate'>

/** Minimal translate service surface this handler relies on from ngx-translate. */
interface TranslateServiceView {
  store?: {
    translations?: Record<string, TranslationTable | undefined>
  }
  currentLoader?: {
    getTranslation: (lang: string) => Observable<TranslationTable>
  }
  parser: TranslateParserView
}

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)

  /**
   * Centralizes the local compatibility view of `TranslateService` in one place.
   *
   * This keeps all structural assumptions and casts away from the fallback logic itself.
   */
  private getTranslateServiceView(params: MissingTranslationHandlerParams): TranslateServiceView {
    return params.translateService
  }

  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        return p.settings?.locales ?? getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    return locales$.pipe(
      concatMap((locales) => this.loadTranslations(locales, params)),
      catchError((err: Error) => {
        console.log('No translation found for key: %s. %O', params.key, err)
        return of(params.key)
      })
    )
  }

  /**
   * Tries to resolve the requested key for one language from cache first and then from the loader.
   *
   * @param lang The language code that should be checked.
   * @param params The ngx-translate missing-translation context containing the key and service.
   * @returns An observable that emits the resolved translation string for the language.
   */
  findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    const translateService = this.getTranslateServiceView(params)
    const storedTranslations = this.getStoredTranslations(params, lang)
    const translatedFromStore = storedTranslations && this.tryGetTranslation(storedTranslations, params)

    if (translatedFromStore !== undefined) {
      return of(translatedFromStore)
    }

    // `currentLoader.getTranslation(lang)` is the low-level ngx-translate API that fetches
    // one language table without changing the active language or resetting cached tables.
    // Intentionally used directly instead of `reloadLang()`, because `reloadLang()` resets
    // the whole language table and emits lang-change events.
    const loader = translateService.currentLoader
    if (!loader) {
      return throwError(() => new Error('No translation loader configured'))
    }

    return loader.getTranslation(lang).pipe(
      map((translations: TranslationTable) => this.requireTranslation(translations, params, lang))
    )
  }

  /**
   * Reads the cached translation table for a language from the ngx-translate store.
   *
   * ngx-translate keeps loaded language tables in `TranslateService.store.translations`.
   *
   * @param params The ngx-translate missing-translation context containing the active service.
   * @param lang The language code whose cached translation table should be read.
   * @returns The cached translation table for the language, or `undefined` when nothing is cached.
   */
  private getStoredTranslations(params: MissingTranslationHandlerParams, lang: string): TranslationTable | undefined {
    return this.getTranslateServiceView(params).store?.translations?.[lang]
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
  ): string {
    const translatedValue = this.tryGetTranslation(translations, params)
    if (translatedValue !== undefined) {
      return translatedValue
    }

    throw new TypeError(`No translation found for key: ${params.key} in language: ${lang}`)
  }

  /**
   * Resolves and interpolates a translation value from a concrete translation table.
   *
   * This mirrors the two parser steps ngx-translate uses internally:
   * 1. `parser.getValue(...)` resolves a raw value by key from the language table.
   * 2. `parser.interpolate(...)` applies `{{param}}` replacements to a string or function result.
   *
   * @param translations The translation table that should be queried.
   * @param params The ngx-translate missing-translation context containing the key and interpolation params.
   * @returns The resolved translation string, or `undefined` when the value cannot be used.
   */
  private tryGetTranslation(translations: TranslationTable, params: MissingTranslationHandlerParams): string | undefined {
    const translateService = this.getTranslateServiceView(params)
    const rawValue = this.getTranslationValue(translations, params)
    const interpolateValue = this.toInterpolatableValue(rawValue)

    return interpolateValue === undefined ? undefined : translateService.parser.interpolate(interpolateValue, params.interpolateParams)
  }

  /**
   * Resolves a key from the translation table.
   *
    * The ngx-translate parser from `TranslateService` is used so fallback lookup
    * follows the same parser configuration as the active translation service.
    * `parser.getValue(target, key)` is ngx-translate's composed-key resolver:
    * it walks nested structures like `a.b.c` and also supports flat dotted keys.
    * Some tables
   * also store flat dotted keys such as `a.b`, so the direct lookup stays first.
    *
    * @param translations The translation table to read from.
    * @param params The ngx-translate missing-translation context containing the key and parser.
    * @returns The raw translation value before interpolation.
   */
  private getTranslationValue(translations: TranslationTable, params: MissingTranslationHandlerParams): unknown {
    const translateService = this.getTranslateServiceView(params)
    const key = params.key

    if (Object.hasOwn(translations, key)) {
      return translations[key]
    }

    return translateService.parser.getValue(translations, key)
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
