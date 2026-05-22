import { scopeAppCssChunkPlugin } from './scopeAppCssChunk'

const invokeGenerateBundle = async (plugin: ReturnType<typeof scopeAppCssChunkPlugin>, bundle: object) => {
  const hook = plugin.generateBundle
  if (!hook) return

  if (typeof hook === 'function') {
    await hook.call({} as never, {} as never, bundle as never, false)
    return
  }

  await hook.handler.call({} as never, {} as never, bundle as never, false)
}

describe('scopeAppCssChunkPlugin', () => {
  it('exposes build plugin metadata', () => {
    const plugin = scopeAppCssChunkPlugin({ productName: 'my-app' })
    expect(plugin.name).toBe('scope-app-css-chunk')
    expect(plugin.apply).toBe('build')
    expect(typeof plugin.generateBundle).toBe('function')
  })

  it('scopes App css asset and keeps global at-rules unscoped', async () => {
    const plugin = scopeAppCssChunkPlugin({ productName: 'my-app' })
    const bundle = {
      appCss: {
        type: 'asset',
        fileName: 'assets/App-abc123.css',
        source:
          '@font-face { font-family: test; src: url(test.woff2); }\n' +
          '@keyframes spin { from { opacity: 0; } to { opacity: 1; } }\n' +
          '.btn { color: red; }',
      },
    }

    await invokeGenerateBundle(plugin, bundle)

    const transformed = String(bundle.appCss.source)
    expect(transformed).toContain('@font-face')
    expect(transformed).toContain('@keyframes spin')
    expect(transformed).toContain('@scope(:is([data-style-id="my-app|my-app"])) to ([data-style-isolation])')
    expect(transformed).toContain('.btn { color: red; }')
  })

  it('respects custom scope limit selector', async () => {
    const plugin = scopeAppCssChunkPlugin({
      productName: 'my-app',
      scopeLimitSelector: '.custom-limit',
    })

    const bundle = {
      appCss: {
        type: 'asset',
        fileName: 'assets/App-abc123.css',
        source: '.card { margin: 0; }',
      },
    }

    await invokeGenerateBundle(plugin, bundle)

    expect(bundle.appCss.source).toContain('@scope(:is([data-style-id="my-app|my-app"])) to (.custom-limit)')
  })

  it('skips non target chunks and already-scoped css', async () => {
    const plugin = scopeAppCssChunkPlugin({ productName: 'my-app' })

    const bundle = {
      jsChunk: {
        type: 'chunk',
        fileName: 'assets/App-abc123.js',
        source: 'console.log(1)',
      },
      cssChunkNotApp: {
        type: 'asset',
        fileName: 'assets/main.css',
        source: '.x { color: red; }',
      },
      cssAlreadyScoped: {
        type: 'asset',
        fileName: 'assets/App-def456.css',
        source: '@scope([data-style-id="my-app|my-app"]) { .x { color: red; } }',
      },
    }

    await invokeGenerateBundle(plugin, bundle)

    expect(bundle.jsChunk.source).toBe('console.log(1)')
    expect(bundle.cssChunkNotApp.source).toBe('.x { color: red; }')
    expect(bundle.cssAlreadyScoped.source).toBe('@scope([data-style-id="my-app|my-app"]) { .x { color: red; } }')
  })
})
