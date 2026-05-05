import { GuardsNavigationStateController } from '../services/guards-navigation-controller'
import type { GuardExecutionContext } from './guard-types.utils'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'

describe('ActivateGuardsWrapper', () => {
  const controller = new GuardsNavigationStateController()

  const context: GuardExecutionContext = {
    location: {
      pathname: '/current',
      search: '',
      hash: '',
      state: null,
      key: 'current',
      unstable_mask: undefined,
    },
    params: {},
    matches: [],
  }

  it('returns true when no guards', async () => {
    const wrapper = new ActivateGuardsWrapper()
    await expect(wrapper.canActivate(context, [])).resolves.toBe(true)
  })

  it('resolves false and reports during guard check', async () => {
    const resolveRoute = jest.fn()
    const wrapper = new ActivateGuardsWrapper({ resolveRoute } as any)
    const guards = [jest.fn(async () => false)]

    const result = await wrapper.canActivate(context, guards, controller.createGuardCheckState())

    expect(result).toBe(false)
    expect(resolveRoute).toHaveBeenCalledWith('/current', false)
  })

  it('blocks when navigation requested guard promise resolves false', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new ActivateGuardsWrapper().canActivate(
      context,
      guards,
      controller.createNavigationRequestedState(Promise.resolve(false))
    )

    expect(result).toBe(false)
  })

  it('passes through guard checks when navigation request resolves true', async () => {
    const guards = [jest.fn(async () => true)]
    const result = await new ActivateGuardsWrapper().canActivate(
      context,
      guards,
      controller.createNavigationRequestedState(Promise.resolve(true))
    )

    expect(result).toBe(true)
  })
})
