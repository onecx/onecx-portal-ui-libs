import { render } from '@testing-library/react'
import type { ComponentType } from 'react'

jest.mock('../theme/StyleRegistry', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="style-registry">{children}</div>,
}))

jest.mock('../contexts/app', () => ({
  PrimeReactStyleProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-style-provider">{children}</div>
  ),
}))

jest.mock('../contexts/remotes', () => ({
  PrimeReactStyleProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="remotes-style-provider">{children}</div>
  ),
}))

const TestChild = () => <span data-testid="child">content</span>

describe('withAppStyles', () => {
  it('wraps component with StyleRegistry', () => {
    const { withAppStyles } = require('./withAppStyles')
    const Wrapped: ComponentType = withAppStyles(TestChild)
    const { getByTestId } = render(<Wrapped />)
    expect(getByTestId('style-registry')).toBeDefined()
    expect(getByTestId('child')).toBeDefined()
  })
})

describe('withRemoteStyles', () => {
  it('wraps remote component with StyleRegistry', () => {
    const { withRemoteStyles } = require('./withRemoteStyles')
    const Wrapped: ComponentType = withRemoteStyles(TestChild)
    const { getByTestId } = render(<Wrapped />)
    expect(getByTestId('style-registry')).toBeDefined()
    expect(getByTestId('child')).toBeDefined()
  })
})

describe('withAppPrimereactStylesIsolation', () => {
  it('wraps component with app PrimeReactStyleProvider', () => {
    const { withAppPrimereactStylesIsolation } = require('./withAppPrimereactStylesIsolation')
    const Wrapped: ComponentType = withAppPrimereactStylesIsolation(TestChild)
    const { getByTestId } = render(<Wrapped />)
    expect(getByTestId('app-style-provider')).toBeDefined()
    expect(getByTestId('child')).toBeDefined()
  })
})

describe('withRemotesPrimereactStylesIsolation', () => {
  it('wraps component with remotes PrimeReactStyleProvider', () => {
    const { withRemotesPrimereactStylesIsolation } = require('./withRemotesPrimereactStylesIsolation')
    const Wrapped: ComponentType = withRemotesPrimereactStylesIsolation(TestChild)
    const { getByTestId } = render(<Wrapped />)
    expect(getByTestId('remotes-style-provider')).toBeDefined()
    expect(getByTestId('child')).toBeDefined()
  })
})
