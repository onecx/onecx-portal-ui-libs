'use strict'

/**
 * Tests for the Tailwind PostCSS wrapper plugin.
 *
 * `@tailwindcss/postcss` is not installed in the libs repo (it is a peer of the consuming app), so
 * it is mocked virtually. `postcss` is mocked to observe how the wrapper orchestrates the pipeline
 * (it must build a one-plugin pipeline and process the entry file with `{ from, map: false }`).
 *
 * The plugin's `Once` follows the PostCSS contract `Once(root, { result })`; the entry path comes from
 * `root.source.input.file` or, as a fallback, `result.opts.from`.
 */

// Registered (hoisted) before the plugin is required; the plugin's runtime `require`s inside `Once`
// resolve to these mocks. Both factories are jest.fn so their calls can be asserted.
jest.mock('@tailwindcss/postcss', () => {
  const factory = jest.fn((opts: unknown) => ({ kind: 'onecx-mock-tailwind', opts }))
  return factory
}, { virtual: true })

jest.mock('postcss', () => {
  // `process` is shared per pipeline call; it is exposed on the object returned by postcss(plugins).
  const process = jest.fn(async () => undefined)
  const postcss = jest.fn((plugins: unknown[]) => ({ plugins, process }))
  return postcss
})

// `require` (not a type-checked import) so the `.cjs` plugin and the mocked deps resolve at runtime.
const createAppTailwindPostCssPlugin: any = require('./tailwind-postcss.cjs')
const postcssMock: any = require('postcss')
const tailwindMockFactory: any = require('@tailwindcss/postcss')

function makeRoot(file: string): any {
  return { source: { input: { file } } }
}

function makeResult(from: string): any {
  return { result: { opts: { from } } }
}

describe('createAppTailwindPostCssPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('exports a PostCSS factory with .postcss === true', () => {
    expect(typeof createAppTailwindPostCssPlugin).toBe('function')
    expect(createAppTailwindPostCssPlugin.postcss).toBe(true)
  })

  it('builds a PostCSS plugin with a stable name and an Once hook', () => {
    const plugin: any = createAppTailwindPostCssPlugin()
    expect(plugin.postcssPlugin).toBe('onecx-app-tailwind')
    expect(typeof plugin.Once).toBe('function')
  })

  it('is a no-op when the file is not the Tailwind entry', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()

    await plugin.Once(makeRoot('/app/src/other.css'), makeResult('/app/src/other.css'))

    // Never reaches the pipeline: neither postcss() nor the tailwind factory is touched.
    expect(postcssMock).not.toHaveBeenCalled()
    expect(tailwindMockFactory).not.toHaveBeenCalled()
  })

  it('runs Tailwind when the file is the entry and processes with { from, map: false }', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()
    const root: any = makeRoot('/app/src/tailwind.css')

    await plugin.Once(root, makeResult('/app/src/tailwind.css'))

    // postcss() is called with a single-plugin pipeline, and that plugin is a tailwind() instance.
    expect(postcssMock).toHaveBeenCalledTimes(1)
    const [plugins]: any[] = postcssMock.mock.calls[0]
    expect(plugins).toHaveLength(1)
    expect(plugins[0]).toEqual({ kind: 'onecx-mock-tailwind', opts: undefined })

    // The pipeline processes the same root with the entry path as `from` and no map.
    const { process }: any = postcssMock.mock.results[0].value
    expect(process).toHaveBeenCalledTimes(1)
    expect(process).toHaveBeenCalledWith(root, { from: '/app/src/tailwind.css', map: false })
  })

  it('logs a success message on the build console after compiling the entry', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined)
    try {
      await plugin.Once(makeRoot('/app/src/tailwind.css'), makeResult('/app/src/tailwind.css'))
      expect(log).toHaveBeenCalledWith(
        '[build-utils] Tailwind PostCSS: successfully compiled Tailwind v4 for tailwind.css',
      )
    } finally {
      log.mockRestore()
    }
  })

  it('does not log when the file is not the entry', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined)
    try {
      await plugin.Once(makeRoot('/app/src/other.css'), makeResult('/app/src/other.css'))
      expect(log).not.toHaveBeenCalled()
    } finally {
      log.mockRestore()
    }
  })

  it('matches on the basename, ignoring a webpack query suffix', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()

    await plugin.Once(makeRoot('/app/src/tailwind.css?raw=true'), makeResult('/app/src/tailwind.css?raw=true'))

    expect(postcssMock).toHaveBeenCalledTimes(1)
  })

  it('supports a custom entry via the options argument', async () => {
    const plugin: any = createAppTailwindPostCssPlugin({ entry: 'custom-tw.css' })

    // The default entry no longer matches...
    await plugin.Once(makeRoot('/app/src/tailwind.css'), makeResult('/app/src/tailwind.css'))
    expect(postcssMock).not.toHaveBeenCalled()

    // ...but the configured one does.
    await plugin.Once(makeRoot('/app/src/custom-tw.css'), makeResult('/app/src/custom-tw.css'))
    expect(postcssMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to result.opts.from when root.source is absent', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()
    const root: any = {}

    await plugin.Once(root, makeResult('/app/src/tailwind.css'))

    const { process }: any = postcssMock.mock.results[0].value
    expect(process).toHaveBeenCalledWith(root, { from: '/app/src/tailwind.css', map: false })
  })

  it('is a no-op when neither the root file nor result.opts.from can be resolved', async () => {
    const plugin: any = createAppTailwindPostCssPlugin()

    await plugin.Once({}, makeResult(''))

    expect(postcssMock).not.toHaveBeenCalled()
  })

  it('keeps the lazily-loaded Tailwind instance isolated per plugin instance', async () => {
    const a: any = createAppTailwindPostCssPlugin()
    const b: any = createAppTailwindPostCssPlugin()

    await a.Once(makeRoot('/app/src/tailwind.css'), makeResult('/app/src/tailwind.css'))
    await b.Once(makeRoot('/app/src/tailwind.css'), makeResult('/app/src/tailwind.css'))

    // Both ran through the (mocked) tailwind factory and the postcss pipeline.
    expect(tailwindMockFactory).toHaveBeenCalledTimes(2)
    expect(postcssMock).toHaveBeenCalledTimes(2)
  })
})
