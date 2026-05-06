import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardsNavigationState,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'
import { GuardsNavigationStateController } from './guards-navigation-controller'

describe('GuardsNavigationStateController', () => {
  const controller = new GuardsNavigationStateController()

  it('detects guard modes', () => {
    expect(controller.getMode({ [IS_INITIAL_ROUTER_SYNC]: true })).toBe(GUARD_MODE.INITIAL_ROUTER_SYNC)
    expect(controller.getMode({ [IS_ROUTER_SYNC]: true })).toBe(GUARD_MODE.ROUTER_SYNC)
    expect(controller.getMode({ [GUARD_CHECK]: true })).toBe(GUARD_MODE.GUARD_CHECK)
    expect(controller.getMode({})).toBe(GUARD_MODE.NAVIGATION_REQUESTED)
  })

  it('creates initial router sync state', () => {
    const state = controller.createInitialRouterSyncState()
    expect(state[IS_ROUTER_SYNC]).toBe(true)
    expect(state[IS_INITIAL_ROUTER_SYNC]).toBe(true)
  })

  it('creates guard check state and preserves key', () => {
    const state: GuardsNavigationState = controller.createGuardCheckState(undefined, 'key-1')
    expect(state[GUARD_CHECK]).toBe(true)
    expect(state['guardCheckKey']).toBe('key-1')
  })

  it('creates navigation requested state', () => {
    const promise = Promise.resolve(true)
    const state = controller.createNavigationRequestedState(promise)
    expect(state[GUARD_CHECK_PROMISE]).toBe(promise)
  })

  it('extracts guard check promise', () => {
    const promise = Promise.resolve(true)
    const state: GuardsNavigationState = { [GUARD_CHECK_PROMISE]: promise }
    expect(controller.getGuardCheckPromise(state)).toBe(promise)
  })
})
