import { attachPrimeReactScoper } from './index'

const originalConsoleError = console.error

const flushMutations = async () => {
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('attachPrimeReactScoper', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation()
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

  it('creates scoped app style tag and processes existing PrimeReact styles', () => {
    const sourceStyle = document.createElement('style')
    sourceStyle.dataset.primereactStyleId = 'base'
    sourceStyle.textContent = '.x { color: red; }'
    document.head.appendChild(sourceStyle)

    const detach = attachPrimeReactScoper({
      id: 'app|app',
      productName: 'app',
      scopeRootSelector: '[data-style-id="app|app"]',
      bootstrapExisting: true,
    })

    const targetStyle = document.head.querySelector('style[data-app-primereact-style="app|app"]')
    expect(targetStyle).toBeTruthy()
    expect(targetStyle?.textContent).toContain('primereact:base')
    expect(targetStyle?.textContent).toContain('@scope([data-style-id="app|app"])')

    detach()
  })

  it('rewrites original PrimeReact source style when source scoping is enabled', () => {
    const sourceStyle = document.createElement('style')
    sourceStyle.dataset.primereactStyleId = 'base'
    sourceStyle.textContent = '.x { color: red; }'
    document.head.appendChild(sourceStyle)

    const detach = attachPrimeReactScoper({
      id: 'app|app',
      productName: 'app',
      scopeRootSelector: '[data-style-id="app|app"]',
      bootstrapExisting: true,
      scopePrimeReactSourceStyles: true,
    })

    expect(sourceStyle.dataset.appPrimeScoped).toBe('true')
    expect(sourceStyle.textContent).toContain('@scope([data-style-id="app|app"]) to ([data-style-isolation])')

    detach()
  })

  it('adjusts @scope selector for theme styles captured through data-app-styles', () => {
    const themeStyle = document.createElement('style')
    themeStyle.dataset.appStyles = 'app|app'
    themeStyle.textContent = '@scope([data-style-id="legacy|legacy"]) { .theme { color: blue; } }'
    document.head.appendChild(themeStyle)

    const detach = attachPrimeReactScoper({
      id: 'app|app',
      productName: 'app',
      scopeRootSelector: '[data-style-id="app|app"]',
      bootstrapExisting: true,
    })

    const targetStyle = document.head.querySelector('style[data-app-primereact-style="app|app"]')
    expect(targetStyle?.textContent).toContain('@scope([data-style-id="app|app"]) { .theme { color: blue; } }')

    detach()
  })

  it('captures existing theme styles matched by id prefix during bootstrap', () => {
    const themeStyle = document.createElement('style')
    themeStyle.id = 'app|app-theme'
    themeStyle.textContent = '@scope([data-style-id="legacy|legacy"]) { .theme-id { color: purple; } }'
    document.head.appendChild(themeStyle)

    const detach = attachPrimeReactScoper({
      id: 'app|app',
      productName: 'app',
      scopeRootSelector: '[data-style-id="app|app"]',
      bootstrapExisting: true,
    })

    const targetStyle = document.head.querySelector('style[data-app-primereact-style="app|app"]')
    expect(targetStyle?.textContent).toContain('primereact:app|app-theme')
    expect(targetStyle?.textContent).toContain('@scope([data-style-id="app|app"]) { .theme-id { color: purple; } }')

    detach()
  })

  it('does not update captured style when blockFurtherUpdatesForCapturedIds is enabled', async () => {
    const sourceStyle = document.createElement('style')
    sourceStyle.dataset.primereactStyleId = 'base'
    sourceStyle.textContent = '.x { color: red; }'
    document.head.appendChild(sourceStyle)

    const detach = attachPrimeReactScoper({
      id: 'app|app',
      productName: 'app',
      scopeRootSelector: '[data-style-id="app|app"]',
      bootstrapExisting: true,
      blockFurtherUpdatesForCapturedIds: true,
    })

    sourceStyle.textContent = '.x { color: green; }'
    await flushMutations()

    const targetStyle = document.head.querySelector('style[data-app-primereact-style="app|app"]')
    expect(targetStyle?.textContent).toContain('color: red')
    expect(targetStyle?.textContent).not.toContain('color: green')

    detach()
  })
})
