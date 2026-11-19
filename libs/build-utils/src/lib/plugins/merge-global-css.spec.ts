'use strict'

/**
 * Tests for the MergeGlobalCssPlugin webpack plugin.
 *
 * Uses the real `webpack` (for the process-assets stage constant) and `webpack-sources` (RawSource),
 * with a minimal hand-rolled compiler/compilation harness so the plugin's hooks can be captured and
 * invoked deterministically.
 */
const webpack: any = require('webpack')
const { RawSource }: any = require('webpack-sources')

// `require` (not a type-checked import) so the `.cjs` plugin resolves at runtime.
const MergeGlobalCssPlugin: any = require('./merge-global-css.cjs')

/**
 * Builds a fake compiler + compilation wired to the plugin's hooks.
 *
 * `compilation.hooks.processAssets.tapPromise` is the one real implementation (it stores the plugin's
 * process-assets callback and runs it when `run()` is called). `compiler.hooks.thisCompilation.tap`
 * stores the plugin's per-compilation callback; `compilation` is created after the plugin's `apply()`
 * so that callback is already stored and can be invoked with the live compilation.
 */
function makeHarness(builtCss: Record<string, string>, plugin: any) {
  let thisCompilationCb: any = null
  let processAssetsCb: any = null

  const compiler: any = {
    hooks: {
      thisCompilation: {
        tap: (_name: string, cb: any) => {
          thisCompilationCb = cb
        },
      },
    },
    logger: { info: jest.fn() },
  }

  const assets: Record<string, string> = {}
  const emitted: Record<string, any> = {}
  const compilation: any = {
    // The plugin reads Object.keys(compilation.assets) to enumerate emitted css; mirror the live map.
    get assets(): Record<string, string> {
      return assets
    },
    getAsset: (name: string) =>
      assets[name]
        ? { source: { source: () => assets[name], size: () => assets[name].length } }
        : null,
    updateAsset: jest.fn((name: string, newSource: any) => {
      assets[name] = newSource.source()
    }),
    emitAsset: jest.fn((name: string, source: any) => {
      emitted[name] = source
    }),
    hooks: {
      processAssets: {
        tapPromise: (_opts: any, cb: any) => {
          processAssetsCb = cb
        },
      },
    },
  }

  for (const [name, content] of Object.entries(builtCss)) {
    assets[name] = content
  }

  // Register the plugin's hooks on the compiler (mirrors webpack calling plugin.apply(compiler)).
  plugin.apply(compiler)

  const run = async () => {
    thisCompilationCb(compilation)
    await processAssetsCb()
  }

  return { compiler, compilation, emitted, assets, run }
}

describe('MergeGlobalCssPlugin', () => {
  let logSpy: jest.SpyInstance

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('merges the bundles in cascade order into styles.css via emitAsset when styles.css is absent', async () => {
    const plugin = new MergeGlobalCssPlugin()
    const { compilation, emitted, run } = makeHarness(
      { 'styles.abc123.css': '/* global */ body { color: red }', 'tailwind.def456.css': '.tw { color: blue }' },
      plugin
    )

    await run()

    expect(compilation.emitAsset).toHaveBeenCalledTimes(1)
    const [name, source]: any[] = compilation.emitAsset.mock.calls[0]
    expect(name).toBe('styles.css')
    expect(source).toBeInstanceOf(RawSource)
    // styles first, tailwind after (later wins in the cascade).
    expect(source.source()).toBe('/* global */ body { color: red }\n.tw { color: blue }')
    // The merge is reflected in the emitted map.
    expect(emitted['styles.css'].source()).toBe('/* global */ body { color: red }\n.tw { color: blue }')
  })

  it('replaces an existing styles.css via updateAsset and leaves the source bundles intact', async () => {
    // In dev, the global styles entry is emitted unhashed as `styles.css`; the plugin overwrites it.
    const plugin = new MergeGlobalCssPlugin()
    const { compilation, assets, run } = makeHarness(
      {
        'styles.css': 'GLOBAL',
        'tailwind.def456.css': 'TW',
      },
      plugin
    )

    await run()

    expect(compilation.updateAsset).toHaveBeenCalledTimes(1)
    expect(compilation.updateAsset).toHaveBeenCalledWith('styles.css', expect.any(RawSource))
    // updateAsset rewrote styles.css in place; the tailwind source bundle is untouched.
    expect(assets['styles.css']).toBe('GLOBAL\nTW')
    expect(assets['tailwind.def456.css']).toBe('TW')
  })

  it('honours a custom bundles list and its order', async () => {
    const plugin = new MergeGlobalCssPlugin({ bundles: ['tailwind', 'styles'] })
    const { emitted, run } = makeHarness(
      { 'styles.abc123.css': 'styles-content', 'tailwind.def456.css': 'tailwind-content' },
      plugin
    )

    await run()

    expect(emitted['styles.css'].source()).toBe('tailwind-content\nstyles-content')
  })

  it('does nothing when no emitted CSS matches a bundle', async () => {
    const plugin = new MergeGlobalCssPlugin()
    const { compiler, compilation, run } = makeHarness({ 'theme.xyz.css': '/* other */' }, plugin)

    await run()

    expect(compilation.emitAsset).not.toHaveBeenCalled()
    expect(compilation.updateAsset).not.toHaveBeenCalled()
    // Nothing merged, so nothing is logged.
    expect(compiler.logger.info).not.toHaveBeenCalled()
  })

  it('matches bundles only on a path segment boundary (styles vs stylesheets)', async () => {
    const plugin = new MergeGlobalCssPlugin()
    const { compilation, run } = makeHarness({ 'stylesheets.abc123.css': '/* not a match */' }, plugin)

    await run()

    // "stylesheets" must not be treated as the "styles" bundle.
    expect(compilation.emitAsset).not.toHaveBeenCalled()
  })

  it('runs at the report stage of process assets', async () => {
    const plugin = new MergeGlobalCssPlugin()
    let capturedOpts: any = null
    const compiler: any = {
      hooks: {
        thisCompilation: {
          tap: (_n: string, cb: any) =>
            cb({ hooks: { processAssets: { tapPromise: (opts: any) => (capturedOpts = opts) } } }),
        },
      },
      logger: { info: jest.fn() },
    }

    plugin.apply(compiler)

    expect(capturedOpts.name).toBe('MergeGlobalCss')
    expect(capturedOpts.stage).toBe(webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT)
  })

  it('logs the merge summary through the compiler logger', async () => {
    const plugin = new MergeGlobalCssPlugin()
    const { compiler, run } = makeHarness({ 'styles.abc123.css': 'a', 'tailwind.def456.css': 'b' }, plugin)

    await run()

    expect(compiler.logger.info).toHaveBeenCalledWith(
      '[build-utils] Merge Global CSS: successfully merged styles.abc123.css + tailwind.def456.css into styles.css'
    )
  })
})
