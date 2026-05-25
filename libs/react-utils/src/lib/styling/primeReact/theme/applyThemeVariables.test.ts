import applyThemeVariables from './applyThemeVariables'

describe('applyThemeVariables', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    jest.restoreAllMocks()
    // JSDOM CSS parser does not fully support modern at-rules used by runtime styles (@scope/@layer).
    // Suppress parser noise so test output reflects assertion failures only.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('applies variables to scope roots and injects runtime layer block into scoped styles', () => {
    const root = document.createElement('div')
    root.setAttribute('data-style-id', 'demo|app')
    document.body.appendChild(root)

    const fallbackRoot = document.createElement('div')
    fallbackRoot.setAttribute('data-style-id', 'demo')
    document.body.appendChild(fallbackRoot)

    const scopedStyle = document.createElement('style')
    scopedStyle.setAttribute('data-app-styles', 'demo|app')
    scopedStyle.textContent = `@scope(:is([data-style-id="demo|app"])) { .x { color: red; } }`
    document.head.appendChild(scopedStyle)

    applyThemeVariables(
      {
        properties: {
          colors: {
            appPrimaryColor: ' #112233 ',
            appBooleanFlag: true,
          },
        },
      },
      'demo|app'
    )

    expect(root.style.getPropertyValue('--app-primary-color')).toBe('#112233')
    expect(root.style.getPropertyValue('--primary-color')).toBe('#112233')
    expect(root.style.getPropertyValue('--app-boolean-flag')).toBe('true')

    expect(fallbackRoot.style.getPropertyValue('--app-primary-color')).toBe('#112233')

    const content = scopedStyle.textContent || ''
    expect(content).toContain('app-theme-runtime:start')
    expect(content).toContain('--app-primary-color: #112233;')
    expect(content).toContain('--primary-color: #112233;')

    applyThemeVariables(
      {
        properties: {
          colors: {
            appPrimaryColor: '#445566',
          },
        },
      },
      'demo|app'
    )

    const updatedContent = scopedStyle.textContent || ''
    expect(updatedContent.match(/app-theme-runtime:start/g)?.length ?? 0).toBe(1)
    expect(updatedContent).toContain('--app-primary-color: #445566;')
  })

  it('warns when no scoped style tags are found and still updates scope roots', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const root = document.createElement('div')
    root.setAttribute('data-style-id', 'demo|app')
    document.body.appendChild(root)

    applyThemeVariables(
      {
        properties: {
          colors: {
            appSecondaryColor: '#abcdef',
          },
        },
      },
      'demo|app'
    )

    expect(root.style.getPropertyValue('--app-secondary-color')).toBe('#abcdef')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]?.[0]).toContain('Style element with data-app-styles')
  })
})
