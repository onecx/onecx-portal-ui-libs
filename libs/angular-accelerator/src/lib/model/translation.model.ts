/**
 * Object containing key for translation with parameters object for translation
 *
 * @example
 * ## Assume such translation is in the translation file
 * ```typescript
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## TranslationKeyWithParameters declaration
 * ```
 * // will be translated into
 * // text with parameter value = hello
 * const myKey: TranslationKeyWithParameters = {
 *   key: 'MY_KEY',
 *   parameters: {
 *     value: 'hello',
 *   },
 * }
 * ```
 */
export type TranslationKeyWithParameters = { key: string; parameters?: Record<string, unknown> }

/**
 * String with key to translation or {@link TranslationKeyWithParameters} object. If provided string cannot be translated it will be displayed as is.
 */
export type TranslationKey = string | TranslationKeyWithParameters
