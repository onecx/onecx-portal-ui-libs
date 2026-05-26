import { getShellMfInstance } from './getShellMfInstance'

describe('getShellMfInstance', () => {
  const originalFederation = (globalThis as any).__FEDERATION__

  beforeEach(() => {
    ;(globalThis as any).__FEDERATION__ = {
      __INSTANCES__: [],
    }
  })

  afterEach(() => {
    ;(globalThis as any).__FEDERATION__ = originalFederation
  })

  it('should return undefined when no instances exist', () => {
    const result = getShellMfInstance()
    expect(result).toBeUndefined()
  })

  it('should return undefined when shell instance is not found', () => {
    ;(globalThis as any).__FEDERATION__.__INSTANCES__ = [
      { name: 'other-app' },
      { name: 'another-app' },
    ]
    const result = getShellMfInstance()
    expect(result).toBeUndefined()
  })

  it('should return the shell module federation instance when found', () => {
    const shellInstance = { name: 'onecx-shell-ui', loadRemote: jest.fn() }
    ;(globalThis as any).__FEDERATION__.__INSTANCES__ = [
      { name: 'other-app' },
      shellInstance,
      { name: 'another-app' },
    ]
    const result = getShellMfInstance()
    expect(result).toBe(shellInstance)
  })

  it('should return the first matching instance when multiple shell instances exist', () => {
    const firstShell = { name: 'onecx-shell-ui', id: 1 }
    const secondShell = { name: 'onecx-shell-ui', id: 2 }
    ;(globalThis as any).__FEDERATION__.__INSTANCES__ = [firstShell, secondShell]
    const result = getShellMfInstance()
    expect(result).toBe(firstShell)
  })
})
