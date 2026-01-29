import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'

jest.mock('./logger.utils', () => ({
  createLogger: jest.fn(),
}))

import { createLogger } from './logger.utils'

@Injectable()
class MockGuard {
  canDeactivate(_component: any, _currentRoute: any, _currentState: any, _nextState: any) {
    console.log('MockGuard canDeactivate called')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('DeactivateGuardsWrapper', () => {
  let wrapper: DeactivateGuardsWrapper
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
        DeactivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        provideGuardsGathererMock(),
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(DeactivateGuardsWrapper)
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
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {} as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith(nextState.url, false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
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
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const component = {}
    const currentRoute = {} as any // No routeConfig
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle empty guards array', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canDeactivate called')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canDeactivate')
      return Promise.resolve(true)
    })
    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canDeactivate')
  })

  it('should handle classes not implementing canDeactivate', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [GenericClass as any])

    expect(result).toBe(true)
    expect(loggerWarn).toHaveBeenCalledWith('Guard does not implement canDeactivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
    expect(loggerWarn).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})
