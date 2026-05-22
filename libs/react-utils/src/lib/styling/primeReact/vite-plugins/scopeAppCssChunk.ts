import type { Plugin } from 'vite'

const APP_CSS_CHUNK_REGEX = /^assets\/App-.*\.css$/
const HAS_SCOPE_RULE_REGEX = /@scope\(/
const APP_STYLE_SCOPE_LIMIT_SELECTOR = '[data-style-isolation]'
const GLOBAL_AT_RULES = new Set(['font-face', 'keyframes', '-webkit-keyframes'])

/**
 * Options for the {@link scopeAppCssChunkPlugin} Vite plugin.
 */
export interface ScopeAppCssChunkOptions {
  /**
   * The product name used to build the CSS scope selector.
   *
   * The generated scope selector will be `:is([data-style-id="<productName>|<productName>"])`.
   * This must match the `productName` used when registering the app's style isolation.
   */
  productName: string

  /**
   * CSS selector that acts as the upper boundary of the `@scope` rule,
   * preventing styles from leaking beyond isolated subtrees.
   *
   * @defaultValue `'[data-style-isolation]'`
   */
  scopeLimitSelector?: string
}

/**
 * Vite build plugin that automatically scopes the app's generated CSS chunk
 * using native CSS `@scope` rules, preventing styles from leaking into
 * PrimeReact remote components or other isolated subtrees.
 *
 * During the build phase it:
 * 1. Finds the `assets/App-*.css` output chunk.
 * 2. Splits rules into **global** (`@font-face`, `@keyframes`) and **scoped** groups.
 * 3. Wraps scoped rules in `@scope(<scopeSelector>) to (<scopeLimitSelector>)`.
 * 4. Replaces the chunk source with the combined output.
 *
 * Already-scoped chunks (containing `@scope(`) are skipped to avoid double-processing.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { scopeAppCssChunkPlugin } from '@onecx/react-utils'
 *
 * export default defineConfig({
 *   plugins: [
 *     scopeAppCssChunkPlugin({ productName: 'my-app' }),
 *   ],
 * })
 * ```
 *
 * @param options - Plugin configuration options.
 * @returns A Vite {@link Plugin} that runs during the `generateBundle` hook.
 */
export function scopeAppCssChunkPlugin({
  productName,
  scopeLimitSelector = APP_STYLE_SCOPE_LIMIT_SELECTOR,
}: ScopeAppCssChunkOptions): Plugin {
  const scopeSelector = `:is([data-style-id="${productName}|${productName}"])`

  return {
    name: 'scope-app-css-chunk',
    apply: 'build',
    async generateBundle(_, bundle) {
      const postcss = (await import('postcss')).default

      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type !== 'asset' ||
          typeof chunk.fileName !== 'string' ||
          !APP_CSS_CHUNK_REGEX.test(chunk.fileName) ||
          typeof chunk.source !== 'string' ||
          HAS_SCOPE_RULE_REGEX.test(chunk.source)
        ) {
          continue
        }

        const root = postcss.parse(chunk.source)
        const globalRoot = postcss.root()
        const scopedRoot = postcss.root()

        root.each((node) => {
          if (node.type === 'atrule' && GLOBAL_AT_RULES.has(node.name)) {
            globalRoot.append(node.clone())
          } else {
            scopedRoot.append(node.clone())
          }
        })

        const globalCss = globalRoot.toString().trim()
        const scopedCssBody = scopedRoot.toString().trim()
        const scopedCss = scopedCssBody
          ? `@scope(${scopeSelector}) to (${scopeLimitSelector}) {\n${scopedCssBody}\n}`
          : ''

        chunk.source = [globalCss, scopedCss].filter(Boolean).join('\n')
      }
    },
  }
}
