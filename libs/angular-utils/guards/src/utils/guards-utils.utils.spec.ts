import { RedirectCommand, UrlTree, ActivatedRouteSnapshot } from '@angular/router'
import { of } from 'rxjs'

jest.mock('./logger.utils', () => ({
  createLogger: jest.fn(),
}))

import { createLogger } from './logger.utils'

const guardsUtils = require('./guards-utils.utils') as typeof import('./guards-utils.utils')

const {
  logGuardsDebug,
  executeRouterSyncGuard,
  combineToGuardResult,
  combineToBoolean,
  resolveToPromise,
  getUrlFromSnapshot,
} = guardsUtils

describe('logGuardsDebug', () => {
  const loggerDebug = jest.fn()

  beforeEach(() => {
    jest.mocked(createLogger).mockReturnValue({
      debug: loggerDebug,
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any)
  })

  it('should log debug information', () => {
    logGuardsDebug('Test message', { key: 'value' })

    expect(loggerDebug).toHaveBeenCalledWith('Guards:', 'Test message', { key: 'value' })
  })
})

describe('executeRouterSyncGuard', () => {
  const loggerDebug = jest.fn()

  beforeEach(() => {
    jest.mocked(createLogger).mockReturnValue({
      debug: loggerDebug,
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any)
  })

  it('should log a message and return true', () => {
    const result = executeRouterSyncGuard()

    expect(loggerDebug).toHaveBeenCalledWith('Guards:', 'Was RouterSync, returning true.')
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
