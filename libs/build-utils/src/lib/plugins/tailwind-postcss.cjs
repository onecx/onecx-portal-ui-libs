'use strict'

/**
 * PostCSS plugin that compiles Tailwind CSS v4 for a single stylesheet entry ONLY.
 *
 * The Angular/ngx-build-plus style pipeline runs one shared PostCSS pipeline (postcss-import +
 * autoprefixer + whatever `postcss.config.json` declares) for every stylesheet it emits: the
 * global styles, the `@onecx/angular-accelerator` styles entry, and the app's `tailwind` entry.
 * Tailwind v4's `@tailwindcss/postcss` plugin resolves `@import`s and `url()`s eagerly, so it must
 * never run on anything other than the single Tailwind entry: applying it to the accelerator styles
 * (which import from `node_modules/...`) breaks those imports and it would rewrite the font URLs
 * of the primeicons/accelerator stylesheets.
 *
 * This wrapper runs `@tailwindcss/postcss` only when the current file matches `entry` and is a
 * no-op for every other file, so Tailwind's theme tokens and generated utilities stay confined to
 * the `tailwind` bundle.
 *
 * Usage from a consuming app's `postcss.config.json`.
 *
 * NOTE: Angular's webpack build resolves PostCSS config via @angular/build's `loadPostcssConfiguration`,
 * which only looks for `postcss.config.json` / `.postcssrc.json` (NOT `.cjs`/`.js`) and reads plugins in
 * the OBJECT form, `require`-ing each key relative to the config file's directory and asserting
 * `plugin.postcss === true`. The key therefore must be a `require`-able module name (a package subpath,
 * NOT a relative path — a relative key would be treated as a file, and a factory is returned, not an object):
 *
 *   // postcss.config.json
 *   {
 *     "plugins": {
 *       "@onecx/build-utils/plugins/tailwind-postcss": {}
 *     }
 *   }
 *
 * `@tailwindcss/postcss` (v4) must be installed in the consuming app; it is only lazily loaded
 * when the entry file is processed.
 */
const path = require('path')

// The consuming app's Tailwind entry, matched by basename so the match is independent of
// absolute/relative paths and any webpack query suffix.
const DEFAULT_TAILWIND_ENTRY = 'tailwind.css'

function createAppTailwindPostCssPlugin(options = {}) {
  const entry = options.entry || DEFAULT_TAILWIND_ENTRY
  let tailwind

  return {
    postcssPlugin: 'onecx-app-tailwind',
    async Once(root, { result }) {
      const file = (root.source && root.source.input && root.source.input.file) || result.opts.from
      if (!file) {
        return
      }
      const basename = path.basename(file.split('?')[0])
      if (basename !== entry) {
        return
      }

      const postcss = require('postcss')
      if (!tailwind) {
        tailwind = require('@tailwindcss/postcss')
      }
      // Tailwind resolves `@source` and `@import`s relative to the entry file, so pass its path as `from`.
      await postcss([tailwind()]).process(root, { from: file, map: false })
      // PostCSS plugins don't expose a webpack logger, so surface a plain log on the build console.
      // This is the observable signal that the plugin matched the entry and Tailwind compiled.
      console.log(`[build-utils] Tailwind PostCSS: successfully compiled Tailwind v4 for ${basename}`)
    }
  }
}
createAppTailwindPostCssPlugin.postcss = true

module.exports = createAppTailwindPostCssPlugin
