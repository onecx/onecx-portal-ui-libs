import type { Plugin } from 'vite'

const PRIME_REACT_FILE_HINT = 'primereact'
const PRIME_REACT_STYLE_ATTR = 'data-primereact-style-id'
const MISSING_APP_ID_WARNING =
  '[primereact-style-reuse] Missing appId. PrimeReact style patching is disabled to avoid cross-app style collisions.'

const DOUBLE_QUOTED_LOOKUP_PREFIX = String.raw`querySelector("style[data-primereact-style-id=\"".concat(`
const DOUBLE_QUOTED_LOOKUP_SUFFIX = String.raw`, "\"]"))`
const SINGLE_QUOTED_LOOKUP_PREFIX = `querySelector('style[data-primereact-style-id="'.concat(`
const SINGLE_QUOTED_LOOKUP_SUFFIX = `, '"]'))`
const SET_STYLE_ID_PREFIX = `setAttribute('data-primereact-style-id',`

type WarnFn = (message: string) => void

/**
 * Options used to configure PrimeReact style lookup patching.
 *
 * @param appId - Application identifier appended to PrimeReact style ids.
 * @param warn - Optional warning handler used when config is invalid.
 */
export type PrimeReactStyleReusePluginOptions = Readonly<{
  appId: string
  warn?: WarnFn
}>

/**
 * Patches PrimeReact runtime selectors to use app-scoped style ids.
 *
 * @param code - Source module code.
 * @param appId - Application identifier appended to style ids.
 * @returns Patched source code.
 */
function patchPrimeReactStyleLookup(code: string, appId: string): string {
  const patchLookupSelector = (
    input: string,
    prefix: string,
    suffix: string,
    format: (styleName: string) => string
  ): string => {
    let output = ''
    let cursor = 0

    while (cursor < input.length) {
      const start = input.indexOf(prefix, cursor)

      if (start === -1) {
        output += input.slice(cursor)
        break
      }

      output += input.slice(cursor, start)

      const argStart = start + prefix.length
      const commaIndex = input.indexOf(',', argStart)

      if (commaIndex === -1) {
        output += input.slice(start)
        break
      }

      const end = input.indexOf(suffix, commaIndex)

      if (end === -1) {
        output += input.slice(start)
        break
      }

      const styleName = input.slice(argStart, commaIndex).trim()

      output += styleName ? format(styleName) : input.slice(start, end + suffix.length)
      cursor = end + suffix.length
    }

    return output
  }

  const patchSetStyleAttribute = (input: string): string => {
    let output = ''
    let cursor = 0

    while (cursor < input.length) {
      const start = input.indexOf(SET_STYLE_ID_PREFIX, cursor)

      if (start === -1) {
        output += input.slice(cursor)
        break
      }

      output += input.slice(cursor, start)

      const argStart = start + SET_STYLE_ID_PREFIX.length
      const end = input.indexOf(')', argStart)

      if (end === -1) {
        output += input.slice(start)
        break
      }

      const styleName = input.slice(argStart, end).trim()

      output += styleName
        ? `setAttribute('data-primereact-style-id', "".concat(${styleName}, "-${appId}"))`
        : input.slice(start, end + 1)

      cursor = end + 1
    }

    return output
  }

  const withDoubleQuotedSelectors = patchLookupSelector(
    code,
    DOUBLE_QUOTED_LOOKUP_PREFIX,
    DOUBLE_QUOTED_LOOKUP_SUFFIX,
    (styleName) => String.raw`querySelector("style[data-primereact-style-id=\"".concat(${styleName}, "-${appId}\"]"))`
  )

  const withSingleQuotedSelectors = patchLookupSelector(
    withDoubleQuotedSelectors,
    SINGLE_QUOTED_LOOKUP_PREFIX,
    SINGLE_QUOTED_LOOKUP_SUFFIX,
    (styleName) => String.raw`querySelector('style[data-primereact-style-id="'.concat(${styleName},'-${appId}"]'))`
  )

  return patchSetStyleAttribute(withSingleQuotedSelectors)
}

/**
 * Creates a Vite plugin that scopes PrimeReact style reuse by app id.
 *
 * @param options - Plugin configuration options.
 * @returns Vite plugin instance.
 */
export function primeReactStyleReusePlugin({ appId, warn = console.warn }: PrimeReactStyleReusePluginOptions): Plugin {
  const normalizedAppId = appId.trim()
  let missingAppIdWarned = false

  return {
    name: 'primereact-style-reuse',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!normalizedAppId) {
        if (!missingAppIdWarned) {
          warn(MISSING_APP_ID_WARNING)
          missingAppIdWarned = true
        }

        return null
      }

      if (!id.includes(PRIME_REACT_FILE_HINT) || !code.includes(PRIME_REACT_STYLE_ATTR)) {
        return null
      }

      const patchedCode = patchPrimeReactStyleLookup(code, normalizedAppId)

      if (patchedCode === code) {
        return null
      }

      return {
        code: patchedCode,
        map: null,
      }
    },
  }
}
