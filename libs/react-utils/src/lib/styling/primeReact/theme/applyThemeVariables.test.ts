import applyThemeVariables from './applyThemeVariables'

const originalConsoleError = console.error

describe('applyThemeVariables', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      const [firstArg] = args
      const message = firstArg instanceof Error ? firstArg.message : String(firstArg ?? '')

      if (message.includes('Could not parse CSS stylesheet')) {
        return
      }

      originalConsoleError(...args)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return early when theme has no properties', () => {
    applyThemeVariables({}, 'test-id')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('should return early when theme is null', () => {
    // @ts-expect-error runtime guard should handle null payload
    applyThemeVariables(null, 'test-id')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('should warn when no style element is found and still apply vars to scope roots', () => {
    const root = document.createElement('div')
    root.dataset.styleId = 'test-id'
    document.body.appendChild(root)

    applyThemeVariables({ properties: { category: { key: 'value' } } }, 'test-id')

    expect(root.style.getPropertyValue('--app-key')).toBe('value')
    expect(root.style.getPropertyValue('--key')).toBe('value')
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('not found'))
  })

  it('should apply theme variables to matching style element', () => {
    const styleEl = document.createElement('style')
    styleEl.dataset.appStyles = 'test-id'
    styleEl.textContent = '@scope([data-style-id="test-id"]) {\n  .a { color: red; }\n}'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { appMainColor: 'red' } } }, 'test-id')

    expect(styleEl.textContent).toContain('--app-main-color')
    expect(styleEl.textContent).toContain('--main-color')
    expect(styleEl.textContent).toContain('red')
    expect(styleEl.textContent).toContain('/* app-theme-runtime:start */')
    expect(styleEl.textContent).toContain('/* app-theme-runtime:end */')
  })

  it('should apply theme to both full and base style ids', () => {
    const styleEl = document.createElement('style')
    styleEl.dataset.appStyles = 'app'
    styleEl.textContent = '.base { color: black; }'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'blue' } } }, 'app|app-id')

    expect(styleEl.textContent).toContain('--app-key')
    expect(styleEl.textContent).toContain('blue')
  })

  it('should replace stale runtime block instead of duplicating it', () => {
    const styleEl = document.createElement('style')
    styleEl.dataset.appStyles = 'test-id'
    styleEl.textContent =
      '@scope([data-style-id="test-id"]) {\n' +
      '/* app-theme-runtime:start */\n@layer tokens {\n:scope {\n  --app-key: old;\n}\n}\n@layer base {}\n/* app-theme-runtime:end */\n' +
      '.x { color: red; }\n}'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'new' } } }, 'test-id')

    expect(styleEl.textContent).toContain('--app-key: new')
    expect(styleEl.textContent).not.toContain('--app-key: old')
    expect((styleEl.textContent || '').match(/app-theme-runtime:start/g)?.length).toBe(1)
  })

  it('should prepend runtime block when scope opening brace cannot be found', () => {
    const styleEl = document.createElement('style')
    styleEl.dataset.appStyles = 'test-id'
    styleEl.textContent = 'body { color: black; }'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'rebuilt' } } }, 'test-id')

    expect(styleEl.textContent).toContain('body {\n/* app-theme-runtime:start */')
    expect(styleEl.textContent).toContain('--app-key: rebuilt')
    expect(styleEl.textContent).toContain('@layer tokens')
  })

  it('should normalize values and ignore unsupported ones', () => {
    const styleEl = document.createElement('style')
    styleEl.dataset.appStyles = 'test-id'
    styleEl.textContent = '@scope([data-style-id="test-id"]) {\n  .a { color: red; }\n}'
    document.head.appendChild(styleEl)

    applyThemeVariables(
      {
        properties: {
          category: {
            key: '  spaced  ',
            count: 5,
            enabled: true,
            ignoredObject: { nested: true },
            ignoredNull: null,
          },
        },
      },
      'test-id'
    )

    expect(styleEl.textContent).toContain('spaced')
    expect(styleEl.textContent).toContain('--app-count: 5;')
    expect(styleEl.textContent).toContain('--app-enabled: true;')
    expect(styleEl.textContent).not.toContain('ignoredObject')
    expect(styleEl.textContent).not.toContain('ignoredNull')
  })
})
