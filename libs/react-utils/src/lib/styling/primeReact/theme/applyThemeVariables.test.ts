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

  it('returns early without error when theme has no properties', () => {
    // Line 167: return when !theme?.properties
    expect(() => applyThemeVariables({}, 'test')).not.toThrow()
    expect(() => applyThemeVariables({ properties: undefined }, 'test')).not.toThrow()
  })

  it('skips theme property values that are not string, number or boolean', () => {
    // Line 14: normalizeThemeValue returns undefined for null/object/array values
    const root = document.createElement('div')
    root.setAttribute('data-style-id', 'skip-test')
    document.body.appendChild(root)

    applyThemeVariables(
      {
        properties: {
          general: {
            appInvalid: null,
            appObject: { nested: 1 },
            appArray: [1, 2, 3],
            appValid: 'red',
          },
        },
      },
      'skip-test'
    )

    expect(root.style.getPropertyValue('--app-invalid')).toBe('')
    expect(root.style.getPropertyValue('--app-object')).toBe('')
    expect(root.style.getPropertyValue('--app-array')).toBe('')
    expect(root.style.getPropertyValue('--app-valid')).toBe('red')
  })

  it('skips categories with falsy values in theme properties', () => {
    // Line 27 false branch: if (properties[category]) when category is null
    const root = document.createElement('div')
    root.setAttribute('data-style-id', 'null-category-test')
    document.body.appendChild(root)

    applyThemeVariables(
      {
        properties: {
          nullCategory: null as unknown as Record<string, unknown>,
          validCategory: { appColor: 'green' },
        },
      },
      'null-category-test'
    )

    expect(root.style.getPropertyValue('--app-color')).toBe('green')
  })

  it('prepends layer block when style content has no scope body opener', () => {
    // Line 124: findScopeBodyStart returns -1 (no `{` at depth 0)
    // Line 152: insertLayersIntoScope prepends the block when insertAfter === -1
    const scopedStyle = document.createElement('style')
    scopedStyle.setAttribute('data-app-styles', 'no-body-test')
    scopedStyle.textContent = '/* no scope body here */'
    document.head.appendChild(scopedStyle)

    applyThemeVariables(
      {
        properties: {
          colors: {
            appPrimary: '#ff0000',
          },
        },
      },
      'no-body-test'
    )

    const content = scopedStyle.textContent ?? ''
    expect(content).toContain('app-theme-runtime:start')
    expect(content.startsWith('/* app-theme-runtime:start */')).toBe(true)
    expect(content).toContain('--app-primary: #ff0000;')
  })

  it('handles scoped style element with empty textContent', () => {
    // Line 183 false branch: scopedElement.textContent || '' when textContent is empty
    const scopedStyle = document.createElement('style')
    scopedStyle.setAttribute('data-app-styles', 'empty-content-test')
    // textContent defaults to '' (falsy) — triggers the || '' false branch
    document.head.appendChild(scopedStyle)

    applyThemeVariables(
      {
        properties: { colors: { appEmptyColor: 'blue' } },
      },
      'empty-content-test'
    )

    const content = scopedStyle.textContent ?? ''
    expect(content).toContain('app-theme-runtime:start')
    expect(content).toContain('--app-empty-color: blue;')
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
