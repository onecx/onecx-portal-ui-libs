const React = require('react')
const { render } = require('@testing-library/react')

jest.mock('@onecx/react-integration-interface', () => {
  const React = require('react')
  return {
    AppStateProvider: ({ children }) => React.createElement('div', { 'data-testid': 'app-state' }, children),
    ConfigurationProvider: ({ children }) => React.createElement('div', { 'data-testid': 'config' }, children),
    UserProvider: ({ children }) => React.createElement('div', { 'data-testid': 'user' }, children),
  }
}, { virtual: true })

jest.mock('@onecx/react-webcomponents', () => {
  const React = require('react')
  return {
    SyncedRouterProvider: ({ children }) => React.createElement('div', { 'data-testid': 'router' }, children),
  }
}, { virtual: true })

jest.mock('./translationBridge', () => ({
  TranslationBridge: () => null,
}))

const { withBaseProviders } = require('./withBaseProviders')

describe('withBaseProviders', () => {
  it('should wrap a component with all base providers', () => {
    const TestComponent = (props) => props.label
    const Wrapped = withBaseProviders(TestComponent)
    const { container, getByTestId } = render(createElement(Wrapped, { label: 'hello' }))

    expect(getByTestId('app-state')).toBeDefined()
    expect(getByTestId('config')).toBeDefined()
    expect(getByTestId('router')).toBeDefined()
    expect(getByTestId('user')).toBeDefined()
    expect(container.textContent).toContain('hello')
  })
})
