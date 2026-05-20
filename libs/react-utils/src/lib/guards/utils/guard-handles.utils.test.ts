import type { UIMatch } from 'react-router'
import { getGuardsFromMatches } from './guard-handles.utils'
import type {
  CanActivateChildGuard,
  CanActivateGuard,
  CanDeactivateGuard,
  CanMatchGuard,
} from './guard-types.utils'

describe('getGuardsFromMatches', () => {
  it('aggregates guards across matches', () => {
    const canMatch: CanMatchGuard = jest.fn(async () => true)
    const canActivate: CanActivateGuard = jest.fn(async () => true)
    const canActivateChild: CanActivateChildGuard = jest.fn(async () => true)
    const canDeactivate: CanDeactivateGuard = jest.fn(async () => true)

    const matches: UIMatch[] = [
      { handle: { canMatch: [canMatch] }, params: {} } as UIMatch,
      {
        handle: { canActivate: [canActivate], canActivateChild: [canActivateChild], canDeactivate: [canDeactivate] },
        params: {},
      } as UIMatch,
    ]

    const guards = getGuardsFromMatches(matches)

    expect(guards.canMatch).toEqual([canMatch])
    expect(guards.canActivate).toEqual([canActivate])
    expect(guards.canActivateChild).toEqual([canActivateChild])
    expect(guards.canDeactivate).toEqual([canDeactivate])
  })

  it('returns empty arrays when no handles', () => {
    const guards = getGuardsFromMatches([{ params: {} } as UIMatch])

    expect(guards.canMatch).toEqual([])
    expect(guards.canActivate).toEqual([])
    expect(guards.canActivateChild).toEqual([])
    expect(guards.canDeactivate).toEqual([])
  })
})
