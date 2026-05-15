import type { ComponentType } from 'react'

jest.mock('../../../utils/composeProviders', () => ({
  composeProviders:
    (...fns: Array<(c: ComponentType) => ComponentType>) =>
    (Component: ComponentType) =>
      fns.reduce((acc, fn) => fn(acc), Component),
}))

jest.mock('../../../utils/withBaseProviders', () => ({
  withBaseProviders: (c: ComponentType) => c,
}))

const mockWithAppGlobals = jest.fn()
jest.mock('../../../utils/withAppGlobals', () => ({
  withAppGlobals: (c: ComponentType, globals: any) => mockWithAppGlobals(c, globals) ?? c,
}))

jest.mock('./withAppPrimereactStylesIsolation', () => ({
  withAppPrimereactStylesIsolation: (c: ComponentType) => c,
}))

jest.mock('./withAppStyles', () => ({
  withAppStyles: (c: ComponentType) => c,
}))

describe('withApp', () => {
  it('returns a wrapped component', () => {
    const { withApp } = require('./withApp')
    const Component = () => null
    const appGlobals = { PRODUCT_NAME: 'my-product', REMOTES_NAME: 'my-remotes' }

    const Wrapped = withApp(Component, appGlobals)

    expect(Wrapped).toBeDefined()
    expect(typeof Wrapped).toBe('function')
  })

  it('passes appGlobals to withAppGlobals', () => {
    const { withApp } = require('./withApp')
    const Component = () => null
    const appGlobals = { PRODUCT_NAME: 'test', REMOTES_NAME: 'remotes' }

    withApp(Component, appGlobals)

    expect(mockWithAppGlobals).toHaveBeenCalledWith(expect.any(Function), appGlobals)
  })
})
