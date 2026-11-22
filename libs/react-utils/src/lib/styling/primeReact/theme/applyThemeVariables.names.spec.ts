import applyThemeVariables from './applyThemeVariables'

function createScopeRoot(styleId: string): HTMLElement {
  const root = document.createElement('div')
  root.setAttribute('data-style-id', styleId)
  document.body.appendChild(root)
  return root
}

function readProperty(root: HTMLElement, name: string): string {
  return root.style.getPropertyValue(name)
}

describe('applyThemeVariables', () => {
  describe('css variable naming', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      jest.restoreAllMocks()
    })

    it('given a key that only starts with the letters app, when the variables are applied, then the prefix is not stripped', () => {
      const root = createScopeRoot('demo|app')

      applyThemeVariables({ properties: { general: { appearanceMode: 'light' } } }, 'demo|app')

      expect(readProperty(root, '--app-appearance-mode')).toBe('light')
    })

    it('given a key that only starts with the letters app, when the variables are applied, then the name keeps the full key', () => {
      const root = createScopeRoot('demo|app')

      applyThemeVariables({ properties: { general: { applicationName: 'portal' } } }, 'demo|app')

      expect(readProperty(root, '--app-application-name')).toBe('portal')
    })

    it('given a key with the app prefix, when the variables are applied, then the prefix is not repeated', () => {
      const root = createScopeRoot('demo|app')

      applyThemeVariables({ properties: { colors: { appPrimaryColor: '#112233' } } }, 'demo|app')

      expect(readProperty(root, '--app-primary-color')).toBe('#112233')
    })

    it('given a key without the prefix, when the variables are applied, then the app prefix is added', () => {
      const root = createScopeRoot('demo|app')

      applyThemeVariables({ properties: { colors: { plain: 'red' } } }, 'demo|app')

      expect(readProperty(root, '--app-plain')).toBe('red')
    })
  })
})
