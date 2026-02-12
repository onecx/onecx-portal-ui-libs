import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'

jest.mock('./logger.utils', () => ({
  createLogger: jest.fn(),
}))

import { createLogger } from './logger.utils'

@Injectable()
class MockGuard {
  canActivate(_route: any, _state: any): Promise<boolean> {
    console.log('MockGuard canActivate')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('ActivateGuardsWrapper', () => {
  let wrapper: ActivateGuardsWrapper
  let mockRouter: jest.Mocked<Router>
  let mockGuardsGatherer: GuardsGatherer
  let mockNavigationStateController: jest.Mocked<Partial<GuardsNavigationStateController>>
  const loggerWarn = jest.fn()

  beforeEach(() => {
    jest.mocked(createLogger).mockReturnValue({
      debug: jest.fn(),
      info: jest.fn(),
      warn: loggerWarn,
      error: jest.fn(),
    } as any)

    mockRouter = {
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>
    mockNavigationStateController = {
      getMode: jest.fn().mockReturnValue('NAVIGATION_REQUESTED'),
      getGuardCheckPromise: jest.fn().mockReturnValue(Promise.resolve()),
    } as jest.Mocked<Partial<GuardsNavigationStateController>>

    TestBed.configureTestingModule({
      providers: [
        ActivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        provideGuardsGathererMock(),
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(ActivateGuardsWrapper)
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(wrapper).toBeTruthy()
  })

  describe('INITIAL_ROUTER_SYNC', () => {
    it('should run guard and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith('test/route', false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
      expect(guardsGathererSpy).not.toHaveBeenCalled()
    })
  })

  describe('NAVIGATION_REQUESTED', () => {
    it('should wait for guard check promise and return false if guard check fails', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(false))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(false)
    const route = {
      routeConfig: null,
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle no guards gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canActivate')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canActivate')
      return Promise.resolve(true)
    })
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canActivate')
  })

  it('should handle classes not implementing CanActivate', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [GenericClass as any])

    expect(result).toBe(true)
    expect(loggerWarn).toHaveBeenCalledWith('Guard does not implement canActivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(loggerWarn).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})
