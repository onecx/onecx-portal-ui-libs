'use strict'

/**
 * Webpack plugin that folds a fixed set of emitted CSS bundles into a single, stable `styles.css`.
 *
 * Angular/ngx-build-plus (and module federation) emit one CSS asset per stylesheet entry
 * (e.g. `styles.css`, `tailwind.css`). This plugin collects the listed bundles, concatenates them
 * in the given cascade order (later wins), and emits the result as `styles.css`, so downstream
 * consumers always import a single, predictable stylesheet name.
 *
 * `webpack` and `webpack-sources` are expected to be provided by the consuming app (they are part
 * of the Angular build toolchain), so they are resolved lazily at apply time rather than imported
 * at module load.
 *
 * Usage from a consuming app's `webpack.config.js`:
 *
 *   const { MergeGlobalCssPlugin } = require('@onecx/build-utils/plugins/merge-global-css')
 *   ...
 *   plugins: [new MergeGlobalCssPlugin({ bundles: ['styles', 'tailwind'] })]
 */

// Global bundles to fold into the stable styles.css, in cascade order (later wins).
const DEFAULT_BUNDLES = ['styles', 'tailwind']

function readAsset(compilation, name) {
  const asset = compilation.getAsset(name)
  if (!asset) return null
  const s = asset.source.source()
  return typeof s === 'string' ? s : s.toString()
}

class MergeGlobalCssPlugin {
  constructor(options = {}) {
    this.bundles = options.bundles || DEFAULT_BUNDLES
  }

  apply(compiler) {
    // Resolved lazily so a build without webpack loaded at import time still works.
    const { RawSource } = require('webpack-sources')
    const { Compilation } = require('webpack')

    const log = (m) => {
      try {
        compiler.logger && typeof compiler.logger.info === 'function' ? compiler.logger.info(m) : console.log(m)
      } catch (e) {
        console.log(m)
      }
    }

    compiler.hooks.thisCompilation.tap('MergeGlobalCss', (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        { name: 'MergeGlobalCss', stage: Compilation.PROCESS_ASSETS_STAGE_REPORT },
        async () => {
          const names = Object.keys(compilation.assets)
          const css = names.filter((n) => n.endsWith('.css'))
          if (process.env.MERGE_CSS_DEBUG) {
            log(
              '[build-utils] Merge Global CSS [dbg] css assets: ' +
                css.map((n) => n + '=' + compilation.getAsset(n).source.size()).join(', ')
            )
          }

          const found = []
          for (const p of this.bundles) {
            const name = css.find((n) => new RegExp(`^${p}(\\.|$)`).test(n))
            if (name) found.push({ name, css: readAsset(compilation, name) })
          }
          if (!found.length) return
          const merged = found.map((b) => b.css).join('\n')
          if (compilation.getAsset('styles.css')) compilation.updateAsset('styles.css', new RawSource(merged))
          else compilation.emitAsset('styles.css', new RawSource(merged))
          // Observable signal that the merge ran and produced styles.css.
          log(`[build-utils] Merge Global CSS: successfully merged ${found.map((b) => b.name).join(' + ')} into styles.css`)
        }
      )
    })
  }
}

module.exports = MergeGlobalCssPlugin
module.exports.MergeGlobalCssPlugin = MergeGlobalCssPlugin
