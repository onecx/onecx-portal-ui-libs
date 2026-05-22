import { GuardsNavigationStateController } from '../services/guards-navigation-controller'
import type { GuardDeactivationContext } from './guard-types.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

jest.mock('./logger.utils', () => ({
  createLogger: () => ({ warn: jest.fn(), debug: jest.fn() }),
}))

describe('DeactivateGuardsWrapper', () => {
  const controller = new GuardsNavigationStateController()

  const context: GuardDeactivationContext = {
    location: {
      pathname: '/current',
      search: '',
      hash: '',
      state: null,
      key: 'current',
      unstable_mask: undefined,
    },
    nextLocation: {
      pathname: '/next',
      search: '',
      hash: '',
      state: null,
      key: 'next',
      unstable_mask: undefined,
    },
    params: {},
    matches: [],
  }

  it('returns true when no guards', async () => {
    const wrapper = new DeactivateGuardsWrapper()
    await expect(wrapper.canDeactivate(context, [])).resolves.toBe(true)
  })

  it('resolves false and reports during guard check', async () => {
    const resolveRoute = jest.fn()
    const wrapper = new DeactivateGuardsWrapper({ resolveRoute } as any)
    const guards = [jest.fn(async () => false)]

    const result = await wrapper.canDeactivate(context, guards, controller.createGuardCheckState())

    expect(result).toBe(false)
    expect(resolveRoute).toHaveBeenCalledWith('/next', false)
  })

  it('blocks when navigation requested guard promise resolves false', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new DeactivateGuardsWrapper().canDeactivate(
      context,
      guards,
      controller.createNavigationRequestedState(Promise.resolve(false))
    )

    expect(result).toBe(false)
  })

  it('passes through guard checks when navigation request resolves true', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new DeactivateGuardsWrapper().canDeactivate(
      context,
      guards,
      controller.createNavigationRequestedState(Promise.resolve(true))
    )

    expect(result).toBe(true)
  })

  it('returns true in INITIAL_ROUTER_SYNC mode', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new DeactivateGuardsWrapper().canDeactivate(
      context,
      guards,
      controller.createInitialRouterSyncState()
    )
    expect(result).toBe(true)
  })

  it('returns true in ROUTER_SYNC mode (always allow through)', async () => {
    const guards = [jest.fn(async () => false)]
    const state = controller.createInitialRouterSyncState()
    state['isInitialRouterSync'] = false
    const result = await new DeactivateGuardsWrapper().canDeactivate(context, guards, state)
    expect(result).toBe(true)
  })

  it('returns true when NAVIGATION_REQUESTED has no guard check promise', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new DeactivateGuardsWrapper().canDeactivate(context, guards, {})
    expect(result).toBe(true)
  })

  it('returns true when a guard throws during execution', async () => {
    const throwingGuard = jest.fn(() => {
      throw new Error('guard error')
    })
    const result = await new DeactivateGuardsWrapper().canDeactivate(
      context,
      [throwingGuard],
      controller.createInitialRouterSyncState()
    )
    expect(result).toBe(true)
  })

  it('does not call resolveRoute when GUARD_CHECK result is true', async () => {
    const resolveRoute = jest.fn()
    const wrapper = new DeactivateGuardsWrapper({ resolveRoute } as any)
    const guards = [jest.fn(async () => true)]

    await wrapper.canDeactivate(context, guards, controller.createGuardCheckState())
    expect(resolveRoute).not.toHaveBeenCalled()
  })
})
