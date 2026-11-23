import {
  logGuardsDebug,
  executeRouterSyncGuard,
  combineToGuardResult,
  combineToActivateGuardResult,
  combineToBoolean,
  isRedirect,
  resolveToPromise,
  getUrlFromSnapshot,
} from './guards-utils.utils'
import { RedirectCommand, UrlTree, ActivatedRouteSnapshot } from '@angular/router'
import { of } from 'rxjs'

describe('logGuardsDebug', () => {
  const originalConsoleLog = console.log
  const originalDebugState = window['@onecx/angular-utils']?.guards?.debug

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}
    window['@onecx/angular-utils'].guards = window['@onecx/angular-utils'].guards || {}
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = originalDebugState
  })

  it('should log debug information when debug mode is enabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = true

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Test message', { key: 'value' })
  })

  it('should not log debug information when debug mode is disabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = false

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).not.toHaveBeenCalled()
  })
})

describe('executeRouterSyncGuard', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils']!.guards!.debug = true
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = false
  })

  it('should log a message and return true', () => {
    const result = executeRouterSyncGuard()

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Was RouterSync, returning true.')
    expect(result).toBe(true)
  })
})

describe('combineToGuardResult', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(false)
  })

  it('should return the first UrlTree if any guard result is an UrlTree', () => {
    const mockUrlTree = new UrlTree()
    const results = [true, mockUrlTree, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockUrlTree)
  })

  it('should return the first RedirectCommand if any guard result is a RedirectCommand', () => {
    const mockRedirectCommand = new RedirectCommand(new UrlTree())
    const results = [true, mockRedirectCommand, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockRedirectCommand)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(true)
  })
})

describe('combineToActivateGuardResult', () => {
  it('should return false if any guard result is false and no guard redirects', () => {
    const result = combineToActivateGuardResult([true, false, true])
    expect(result).toBe(false)
  })

  it('should return the redirect if guard results contain false and a redirect, independent of the order', () => {
    const mockUrlTree = new UrlTree()
    expect(combineToActivateGuardResult([false, mockUrlTree])).toBe(mockUrlTree)
    expect(combineToActivateGuardResult([mockUrlTree, false])).toBe(mockUrlTree)
  })

  it('should return the first RedirectCommand if any guard result is a RedirectCommand', () => {
    const mockRedirectCommand = new RedirectCommand(new UrlTree())
    const result = combineToActivateGuardResult([true, mockRedirectCommand, new UrlTree()])
    expect(result).toBe(mockRedirectCommand)
  })

  it('should return true if all guard results are true', () => {
    const result = combineToActivateGuardResult([true, true, true])
    expect(result).toBe(true)
  })
})

describe('isRedirect', () => {
  it('should return true for UrlTree and RedirectCommand', () => {
    expect(isRedirect(new UrlTree())).toBe(true)
    expect(isRedirect(new RedirectCommand(new UrlTree()))).toBe(true)
  })

  it('should return false for boolean results', () => {
    expect(isRedirect(true)).toBe(false)
    expect(isRedirect(false)).toBe(false)
  })
})

describe('combineToBoolean', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToBoolean(results)
    expect(result).toBe(false)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToBoolean(results)
    expect(result).toBe(true)
  })
})

describe('resolveToPromise', () => {
  it('should resolve a Promise directly', async () => {
    const mockPromise = Promise.resolve(true)
    const result = await resolveToPromise(mockPromise)
    expect(result).toBe(true)
  })

  it('should resolve an Observable to a Promise', async () => {
    const mockObservable = of(true)
    const result = await resolveToPromise(mockObservable)
    expect(result).toBe(true)
  })

  it('should resolve a plain value to a Promise', async () => {
    const mockValue = true
    const result = await resolveToPromise(mockValue)
    expect(result).toBe(true)
  })
})

describe('getUrlFromSnapshot', () => {
  it('should return the full URL from a nested ActivatedRouteSnapshot', () => {
    const childRoute = {
      url: [{ path: 'child' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const parentRoute = {
      url: [{ path: 'parent' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    ;(childRoute as any).parent = parentRoute

    const result = getUrlFromSnapshot(childRoute)
    expect(result).toBe('parent/child')
  })

  it('should return the URL from a single ActivatedRouteSnapshot', () => {
    const route = {
      url: [{ path: 'single' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('single')
  })

  it('should return an empty string if the route has no URL segments', () => {
    const route = {
      url: [],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('')
  })
})
