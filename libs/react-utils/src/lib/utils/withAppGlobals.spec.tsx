import { createElement } from 'react'
import { render } from '@testing-library/react'
import { withAppGlobals, useAppGlobals } from './withAppGlobals'

function MyFunc() {
  return null
}

describe('withAppGlobals', () => {
  it('should wrap a component and provide globals via context', () => {
    const globals = { PRODUCT_NAME: 'test-app', DEBUG: true }
    const TestComponent = () => {
      const ctx = useAppGlobals()
      return ctx.PRODUCT_NAME
    }
    const Wrapped = withAppGlobals(TestComponent, globals)
    const { container } = render(createElement(Wrapped, {}))
    expect(container.textContent).toBe('test-app')
  })

  it('should set displayName on wrapped component', () => {
    const TestComponent = () => null
    TestComponent.displayName = 'MyComponent'
    const Wrapped = withAppGlobals(TestComponent, { PRODUCT_NAME: 'x' })
    expect(Wrapped.displayName).toBe('withAppGlobals(MyComponent)')
  })

  it('should use component name when displayName is not set', () => {
    const Wrapped = withAppGlobals(MyFunc, { PRODUCT_NAME: 'x' })
    expect(Wrapped.displayName).toBe('withAppGlobals(MyFunc)')
  })

  it('should fallback to Component when no name is available', () => {
    const Wrapped = withAppGlobals(() => null, { PRODUCT_NAME: 'x' })
    expect(Wrapped.displayName).toBe('withAppGlobals(Component)')
  })
})

describe('useAppGlobals', () => {
  it('should throw when used outside provider', () => {
    const TestComponent = () => {
      useAppGlobals()
      return null
    }
    expect(() => render(createElement(TestComponent))).toThrow(
      'useAppGlobals must be used within an AppGlobalsProvider'
    )
  })
})
