import { APP_ID, inject, Injectable } from '@angular/core'
import {
  MissingTranslationHandler,
  getValue,
  MissingTranslationHandlerParams,
  TranslateNoOpLoader,
  TranslateParser,
} from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { DynamicTranslationService, UserService } from '@onecx/angular-integration-interface'
import { TranslationContext } from '@onecx/integration-interface'
import { EMPTY, Observable, from, of } from 'rxjs'
import { catchError, concatMap, map, shareReplay, take, throwIfEmpty } from 'rxjs/operators'
import { MULTI_LANGUAGE_IDENTIFIER } from '../injection-tokens/multi-language-identifier'
import { mergeDeep } from './deep-merge.utils'
import { createLogger } from './logger.utils'

/** Represents one language table loaded from ngx-translate. */
type TranslationTable = Record<string, unknown>

/** Matches the value shapes accepted by `TranslateParser.interpolate`. */
type InterpolatableValue = Parameters<TranslateParser['interpolate']>[0]

/** App identity shape used to derive the app-level translation context name. */
type DynamicAppId = { appElementName?: string }

/**
 * Resolves missing translation keys by walking the user's candidate locales.
 *
 * For each locale the static ngx-translate loader table is consulted first.
 * When the key is absent from the static table, the dynamic translations
 * published by the shell for that same locale are consulted as a fallback.
 * If no locale resolves the key, the raw key is returned.
 *
 * The lookup only reads the loader via `currentLoader.getTranslation(lang)` and
 * never calls `reloadLang` or otherwise mutates the active language, which keeps
 * the resolution stateless and flicker-free.
 */
@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly logger = createLogger('MultiLanguageMissingTranslationHandler')
  private readonly parser = inject(TranslateParser)
  private readonly userService = inject(UserService)
  private readonly dynamicTranslationService = inject(DynamicTranslationService)
  private readonly translationContexts = this.createTranslationContexts()

  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        return p.settings?.locales ?? getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    this.logger.debug(
      'No translation found for key:',
      params.key,
      'in language:',
      params.translateService.currentLang,
      '. Trying to resolve with fallback languages...'
    )

    return locales$.pipe(
      concatMap((locales) => this.loadTranslations(locales, params)),
      catchError((err: Error) => {
        this.logger.warn('No translation found for key:', params.key, err)
        return of(params.key)
      })
    )
  }

  /**
   * Tries to resolve the requested key for one language.
   *
   * The static loader table is checked first; on a miss the dynamic translations
   * for the same language are checked. Both lookups are stateless and never change
   * the active language.
   *
   * @param lang The language code that should be checked.
   * @param params The ngx-translate missing-translation context containing the key and service.
   * @returns An observable that emits the resolved translation string, or is empty when neither source resolves the key.
   */
  findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    // `currentLoader.getTranslation(lang)` is the low-level ngx-translate API that fetches
    // one language table without changing the active language or resetting cached tables.
    // Intentionally used directly instead of `reloadLang()`, because `reloadLang()` resets
    // the whole language table and emits lang-change events.
    const loader = params.translateService.currentLoader

    // if the loader was not configured, we can't do anything about missing translations, so just log a warning
    // loader cannot be null or undefined because ngx-translate falls back to `TranslateNoOpLoader` when no loader is configured
    if (loader instanceof TranslateNoOpLoader) {
      this.logger.warn('No translation loader configured')
    }

    return loader.getTranslation(lang).pipe(
      concatMap((translations: TranslationTable) => {
        const staticTranslation = this.resolveTranslation(translations, params)
        return staticTranslation !== undefined ? of(staticTranslation) : this.findDynamicTranslation(lang, params)
      })
    )
  }

  /**
   * Reads the requested key from a translation table and interpolates it.
   *
   * @param translations The translation table to look the key up in.
   * @param params The ngx-translate missing-translation context containing the requested key.
   * @returns The interpolated translation string, or `undefined` when the key is not usable.
   */
  private resolveTranslation(
    translations: TranslationTable,
    params: MissingTranslationHandlerParams
  ): string | undefined {
    const rawValue = getValue(translations, params.key)
    const interpolateValue = this.toInterpolatableValue(rawValue)

    if (interpolateValue === undefined) {
      return undefined
    }

    return this.parser.interpolate(interpolateValue, params.interpolateParams)
  }

  /**
   * Falls back to the shell's dynamic translations when the static table misses a key.
   *
   * @param lang The language code currently being resolved.
   * @param params The ngx-translate missing-translation context containing the requested key.
   * @returns An observable that emits the dynamically resolved translation, or is empty when unavailable.
   */
  private findDynamicTranslation(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
    return this.dynamicTranslationService.getTranslations(lang, this.translationContexts).pipe(
      concatMap((dynamicRecords) => {
        const mergedTranslations = this.mergeDynamicTranslations(dynamicRecords)
        const translatedValue = this.resolveTranslation(mergedTranslations, params)

        if (translatedValue !== undefined) {
          return of(translatedValue)
        }

        this.logger.warn(`No translation found for key: ${params.key} in language: ${lang}`)
        return EMPTY
      })
    )
  }

  /**
   * Deep-merges the context-keyed dynamic translation records into one locale map.
   *
   * Records may be keyed by context name or by a versioned context key
   * (`name@version`); merging them yields a single table the requested key can be read from.
   *
   * @param dynamicRecords The context-keyed dynamic translation map for one locale.
   * @returns The merged translation table for the locale.
   */
  private mergeDynamicTranslations(
    dynamicRecords: Record<string, Record<string, unknown>>
  ): Record<string, unknown> {
    return Object.values(dynamicRecords).reduce<Record<string, unknown>>(
      (merged, record) => mergeDeep(merged, record ?? {}),
      {}
    )
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

  /**
   * Builds the ordered translation contexts used to scope dynamic translation requests.
   *
   * Contexts are derived from the multi-language identifiers (name/version namespaces).
   * When no identifier is tagged as an app, the app element name from the Angular app
   * identity is used to add a single app-scoped context.
   */
  private createTranslationContexts(): TranslationContext[] {
    const identifiers = inject(MULTI_LANGUAGE_IDENTIFIER, { optional: true, self: true }) ?? []
    const hasAppIdentifier = identifiers.some((identifier) => identifier.type === 'app')
    const appElementName = (inject(APP_ID, { optional: true, self: true }) as DynamicAppId | undefined)
      ?.appElementName

    const contexts: TranslationContext[] = identifiers.map(({ name, version }) => ({ name, version }))

    if (!hasAppIdentifier && appElementName) {
      contexts.push({ name: appElementName })
    }

    return contexts
  }
}
