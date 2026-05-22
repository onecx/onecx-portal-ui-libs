import { createElement } from 'react'
import { render } from '@testing-library/react'
import { withBaseProviders } from './withBaseProviders'

jest.mock('@onecx/react-integration-interface', () => ({
  AppStateProvider: ({ children }: any) => createElement('div', { 'data-testid': 'app-state' }, children),
  ConfigurationProvider: ({ children }: any) => createElement('div', { 'data-testid': 'config' }, children),
  UserProvider: ({ children }: any) => createElement('div', { 'data-testid': 'user' }, children),
}))

jest.mock('@onecx/react-webcomponents', () => ({
  SyncedRouterProvider: ({ children }: any) => createElement('div', { 'data-testid': 'router' }, children),
}))

jest.mock('./translationBridge', () => ({
  TranslationBridge: () => null,
}))

describe('withBaseProviders', () => {
  it('should wrap a component with all base providers', () => {
    const TestComponent = (props: { label: string }) => props.label
    const Wrapped = withBaseProviders(TestComponent)
    const { container, getByTestId } = render(createElement(Wrapped, { label: 'hello' }))

    expect(getByTestId('app-state')).toBeDefined()
    expect(getByTestId('config')).toBeDefined()
    expect(getByTestId('router')).toBeDefined()
    expect(getByTestId('user')).toBeDefined()
    expect(container.textContent).toContain('hello')
  })
})
