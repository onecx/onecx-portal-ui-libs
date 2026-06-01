import type { Location, UIMatch } from 'react-router'
import { wrapGuards } from './wrap-guards.utils'
import type { CanActivateChildGuard, CanActivateGuard, CanDeactivateGuard, CanMatchGuard } from './guard-types.utils'

describe('wrapGuards', () => {
  const location: Location = {
    pathname: '/current',
    search: '',
    hash: '',
    state: null,
    key: 'current',
    unstable_mask: undefined,
  }

  const nextLocation: Location = {
    pathname: '/next',
    search: '',
    hash: '',
    state: null,
    key: 'next',
    unstable_mask: undefined,
  }

  const buildMatches = (handle: Record<string, unknown>): UIMatch[] => [
    {
      handle,
      params: {},
    } as UIMatch,
  ]

  it('executes canMatch, canActivateChild, and canActivate guards', async () => {
    const canMatch: CanMatchGuard = jest.fn(async () => true)
    const canActivateChild: CanActivateChildGuard = jest.fn(async () => true)
    const canActivate: CanActivateGuard = jest.fn(async () => true)

    const wrapped = wrapGuards({
      matches: buildMatches({ canMatch: [canMatch], canActivateChild: [canActivateChild], canActivate: [canActivate] }),
      location,
    })

    await expect(wrapped.canMatch()).resolves.toBe(true)
    await expect(wrapped.canActivateChild()).resolves.toBe(true)
    await expect(wrapped.canActivate()).resolves.toBe(true)

    expect(canMatch).toHaveBeenCalledTimes(1)
    expect(canActivateChild).toHaveBeenCalledTimes(1)
    expect(canActivate).toHaveBeenCalledTimes(1)
  })

  it('returns false when a guard resolves to false', async () => {
    const canMatch: CanMatchGuard = jest.fn(async () => false)
    const canActivate: CanActivateGuard = jest.fn(async () => true)

    const wrapped = wrapGuards({
      matches: buildMatches({ canMatch: [canMatch], canActivate: [canActivate] }),
      location,
    })

    await expect(wrapped.canMatch()).resolves.toBe(false)
    await expect(wrapped.canActivate()).resolves.toBe(true)
  })

  it('returns empty params object when matches array is empty', async () => {
    const wrapped = wrapGuards({ matches: [], location })
    await expect(wrapped.canActivate()).resolves.toBe(true)
    await expect(wrapped.canMatch()).resolves.toBe(true)
  })

  it('executes canDeactivate guards with next location', async () => {
    const canDeactivate: CanDeactivateGuard = jest.fn(async ({ nextLocation: target }) => target.pathname === '/next')

    const wrapped = wrapGuards({
      matches: buildMatches({ canDeactivate: [canDeactivate] }),
      location,
    })

    await expect(wrapped.canDeactivate(nextLocation)).resolves.toBe(true)
    expect(canDeactivate).toHaveBeenCalledWith(
      expect.objectContaining({
        location,
        nextLocation,
      })
    )
  })
})
