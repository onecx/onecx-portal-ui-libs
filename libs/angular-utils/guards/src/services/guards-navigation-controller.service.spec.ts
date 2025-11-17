import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

describe('GuardsNavigationStateController', () => {
  let controller: GuardsNavigationStateController

  beforeEach(() => {
    controller = new GuardsNavigationStateController()
  })

  it('should return INITIAL_ROUTER_SYNC mode if IS_INITIAL_ROUTER_SYNC is true', () => {
    const state = { [IS_INITIAL_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.INITIAL_ROUTER_SYNC)
  })

  it('should return ROUTER_SYNC mode if IS_ROUTER_SYNC is true', () => {
    const state = { [IS_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.ROUTER_SYNC)
  })

  it('should return GUARD_CHECK mode if GUARD_CHECK is true', () => {
    const state = { [GUARD_CHECK]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.GUARD_CHECK)
  })

  it('should return NAVIGATION_REQUESTED mode if no other mode is set', () => {
    const state = {}
    expect(controller.getMode(state)).toBe(GUARD_MODE.NAVIGATION_REQUESTED)
  })

  it('should create initial router sync state', () => {
    const state = controller.createInitialRouterSyncState()
    expect(state[IS_ROUTER_SYNC]).toBe(true)
    expect(state[IS_INITIAL_ROUTER_SYNC]).toBe(true)
  })

  it('should modify existing state to initial router sync state', () => {
    const existingState = {}
    const expectedState = {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }

    const state = controller.createInitialRouterSyncState(existingState)

    expect(state).toBe(existingState)
    expect(state).toEqual(expectedState)
  })

  it('should create guard check state', () => {
    const state = controller.createGuardCheckState()
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should modify existing state to guard check state', () => {
    const existingState = {}
    const state = controller.createGuardCheckState(existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should create navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const state = controller.createNavigationRequestedState(mockPromise)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should modify existing state to navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const existingState = {}
    const state = controller.createNavigationRequestedState(mockPromise, existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should retrieve GuardCheckPromise from state', () => {
    const mockPromise = Promise.resolve(true)
    const state = { [GUARD_CHECK_PROMISE]: mockPromise }
    expect(controller.getGuardCheckPromise(state)).toBe(mockPromise)
  })

  it('should return undefined if GuardCheckPromise is not in state', () => {
    const state = {}
    expect(controller.getGuardCheckPromise(state)).toBeUndefined()
  })
})
