import applyThemeVariables from './applyThemeVariables'

describe('applyThemeVariables', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return early when theme has no properties', () => {
    applyThemeVariables({}, 'test-id')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('should return early when theme is null', () => {
    applyThemeVariables(null, 'test-id')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('should warn when no style element is found', () => {
    applyThemeVariables({ properties: { category: { key: 'value' } } }, 'test-id')
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('not found'))
  })

  it('should apply theme variables to matching style element', () => {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-app-styles', 'test-id')
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'red' } } }, 'test-id')

    expect(styleEl.textContent).toContain('--appkey')
    expect(styleEl.textContent).toContain('red')
  })

  it('should handle styleId with -ui suffix', () => {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-app-styles', 'app|app-id')
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'blue' } } }, 'app|app-id-ui')

    expect(styleEl.textContent).toContain('--appkey')
    expect(styleEl.textContent).toContain('blue')
  })

  it('should update existing tokens layer', () => {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-app-styles', 'test-id')
    styleEl.textContent = '@layer tokens {\n:scope {\n  --appkey: old;\n}\n}\n@layer base {}\nsome content'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'new' } } }, 'test-id')

    expect(styleEl.textContent).toContain('--appkey: new')
    expect(styleEl.textContent).not.toContain('--appkey: old')
  })

  it('should rebuild tokens layer when existing tokens block has no :scope block', () => {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-app-styles', 'test-id')
    styleEl.textContent = '@layer tokens {\n  /* no scope block here */\n}\n@layer base {}\nsome content'
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: 'rebuilt' } } }, 'test-id')

    expect(styleEl.textContent).toContain('--appkey: rebuilt')
    expect(styleEl.textContent).toContain('@layer tokens')
  })

  it('should trim whitespace from values', () => {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-app-styles', 'test-id')
    document.head.appendChild(styleEl)

    applyThemeVariables({ properties: { category: { key: '  spaced  ' } } }, 'test-id')

    expect(styleEl.textContent).toContain('spaced')
  })
})
