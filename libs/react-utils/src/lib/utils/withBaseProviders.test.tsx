import React, { type ReactNode } from 'react'
import { render } from '@testing-library/react'
import { withBaseProviders } from './withBaseProviders'

jest.mock('@onecx/react-integration-interface', () => {
  const React = require('react')
  return {
    AppStateProvider: ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-testid': 'app-state' }, children),
    ConfigurationProvider: ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-testid': 'config' }, children),
    UserProvider: ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-testid': 'user' }, children),
  }
})

jest.mock('@onecx/react-webcomponents', () => {
  const React = require('react')
  return {
    SyncedRouterProvider: ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-testid': 'router' }, children),
  }
})

jest.mock('./translationBridge', () => ({
  TranslationBridge: () => null,
}))

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
