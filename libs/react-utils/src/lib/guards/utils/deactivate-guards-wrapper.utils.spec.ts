import { GuardsNavigationStateController } from '../services/guards-navigation-controller'
import type { GuardDeactivationContext } from './guard-types.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

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
})
