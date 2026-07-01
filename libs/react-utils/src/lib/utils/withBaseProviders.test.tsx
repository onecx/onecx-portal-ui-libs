import { render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { withBaseProviders } from './withBaseProviders'

jest.mock('@onecx/react-integration-interface', () => ({
  AppStateProvider: ({ children }: PropsWithChildren) => <div data-testid="app-state">{children}</div>,
  ConfigurationProvider: ({ children }: PropsWithChildren) => <div data-testid="config">{children}</div>,
  UserProvider: ({ children }: PropsWithChildren) => <div data-testid="user">{children}</div>,
}))

jest.mock('@onecx/react-webcomponents', () => ({
  SyncedRouterProvider: ({ children }: PropsWithChildren) => <div data-testid="router">{children}</div>,
}))

jest.mock('./translationBridge', () => ({
  TranslationBridge: () => null,
}))

describe('withBaseProviders', () => {
  it('should wrap a component with all base providers', () => {
    const TestComponent = ({ label }: { label: string }) => label
    const Wrapped = withBaseProviders(TestComponent)
    const { container, getByTestId } = render(<Wrapped label="hello" />)

    expect(getByTestId('app-state')).toBeDefined()
    expect(getByTestId('config')).toBeDefined()
    expect(getByTestId('router')).toBeDefined()
    expect(getByTestId('user')).toBeDefined()
    expect(container.textContent).toContain('hello')
  })
})
