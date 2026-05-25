import type { Plugin } from 'vite'

const PRIME_REACT_FILE_HINT = 'primereact'
const PRIME_REACT_STYLE_ATTR = 'data-primereact-style-id'
const MISSING_APP_ID_WARNING =
  '[primereact-style-reuse] Missing appId. PrimeReact style patching is disabled to avoid cross-app style collisions.'

const DOUBLE_QUOTED_LOOKUP_PATTERN = /querySelector\("style\[data-primereact-style-id=.*?\.concat\(([^,]+),\s*.*?\)\)/g
const SINGLE_QUOTED_LOOKUP_PATTERN = /querySelector\('style\[data-primereact-style-id=.*?\.concat\(([^,]+),\s*.*?\)\)/g
const SET_STYLE_ID_PATTERN = /setAttribute\('data-primereact-style-id',\s*([^)]+)\)/g

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
  const withDoubleQuotedSelectors = code.replace(
    DOUBLE_QUOTED_LOOKUP_PATTERN,
    (_, styleName: string) =>
      String.raw`querySelector("style[data-primereact-style-id=\"".concat(${styleName}, "-${appId}\"]"))`
  )

  const withSingleQuotedSelectors = withDoubleQuotedSelectors.replace(
    SINGLE_QUOTED_LOOKUP_PATTERN,
    (_, styleName: string) =>
      String.raw`querySelector('style[data-primereact-style-id="'.concat(${styleName},'-${appId}"]'))`
  )

  return withSingleQuotedSelectors.replace(
    SET_STYLE_ID_PATTERN,
    (_, styleName: string) => `setAttribute('data-primereact-style-id', "".concat(${styleName}, "-${appId}"))`
  )
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
