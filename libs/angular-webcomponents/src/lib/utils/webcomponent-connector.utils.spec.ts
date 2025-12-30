import { TestBed } from '@angular/core/testing'
import { GuardsCheckEnd, GuardsCheckStart, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router'
import { Injector } from '@angular/core'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'
import {
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsGatherer,
  GuardsNavigationState,
  GuardsNavigationStateController,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
  wrapGuards,
} from '@onecx/angular-utils/guards'
import { AppStateService, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { FakeTopic, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { WebcomponentConnector } from './webcomponent-connector.utils'
import { ReplaySubject, Subject } from 'rxjs'
import { Location } from '@angular/common'
import { Route } from '@onecx/integration-interface'

const deploymentPathMock = '/mock-path/'
const applicationPathMock = 'admin/ui'
const locationPathMock = Location.joinWithSlash(deploymentPathMock, applicationPathMock)

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getLocation: jest.fn().mockReturnValue({ deploymentPath: '/mock-path/' }),
  }
})

jest.mock('@onecx/angular-utils/guards', () => {
  const actual = jest.requireActual('@onecx/angular-utils/guards')
  return {
    ...actual,
    wrapGuards: jest.fn(),
  }
})

const changeLocation = (pathName: string) => {
  window.history.pushState({}, '', pathName)
}

describe('WebcomponentConnector', () => {
  let connector: WebcomponentConnector
  let mockGuardsNavigationStateController: jest.Mocked<GuardsNavigationStateController>
  let mockCapabilityService: jest.Mocked<ShellCapabilityService>
  let mockRouter: jest.Mocked<Router>
  let mockAppStateService: AppStateService
  let eventsTopic: FakeTopic<any>
  let mockGuardsGatherer: GuardsGatherer
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    mockGuardsNavigationStateController = {
      getMode: jest.fn(),
      createNavigationRequestedState: jest.fn(),
    } as unknown as jest.Mocked<GuardsNavigationStateController>

    mockCapabilityService = {
      hasCapability: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<ShellCapabilityService>

    mockRouter = {
      events: new Subject<any>(),
      navigateByUrl: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({ extras: { state: {} } }),
    } as unknown as jest.Mocked<Router>

    TestBed.configureTestingModule({
      providers: [
        provideGuardsGathererMock(),
        { provide: GuardsNavigationStateController, useValue: mockGuardsNavigationStateController },
        { provide: Router, useValue: mockRouter },
        provideAppStateServiceMock(),
      ],
    })

    connector = new WebcomponentConnector(TestBed.inject(Injector), 'microfrontend')
    eventsTopic = new FakeTopic<any>()
    connector['eventsTopic'] = eventsTopic as any
    connector['capabilityService'] = mockCapabilityService
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
    mockAppStateService = TestBed.inject(AppStateService)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    changeLocation(locationPathMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should activate guards gatherer on connect', () => {
    const spy = jest.spyOn(mockGuardsGatherer, 'activate')
    connector.connect()

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should deactivate guards gatherer and destroy events topic on disconnect', () => {
    connector.connect()

    const destroySpy = jest.spyOn(eventsTopic, 'destroy')
    const deactivateSpy = jest.spyOn(mockGuardsGatherer, 'deactivate')

    connector.disconnect()

    expect(destroySpy).toHaveBeenCalled()
    expect(deactivateSpy).toHaveBeenCalled()
  })

  it('should warn if no router is found', () => {
    const injector = TestBed.inject(Injector)
    jest.spyOn(injector, 'get').mockReturnValueOnce(null)

    connector.connect()

    expect(consoleWarnSpy).toHaveBeenCalledWith('No router to connect found')
  })

  it('should warn if no AppStateService is found', () => {
    const injector = TestBed.inject(Injector)
    jest.spyOn(injector, 'get').mockReturnValueOnce(mockRouter).mockReturnValueOnce(null)

    connector.connect()

    expect(consoleWarnSpy).toHaveBeenCalledWith('No appStateService found')
  })

  it('should perform initial navigation on connect', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    expect(navigationSpy).toHaveBeenCalledWith(applicationPathMock, {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
        [IS_INITIAL_ROUTER_SYNC]: true,
      },
    })
  })

  it('should perform router sync on currentLocation change', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    changeLocation(`${deploymentPathMock}/new-path`)
    mockAppStateService.currentLocation$.publish({
      url: 'url',
      isFirst: false,
    })

    expect(navigationSpy).toHaveBeenCalledWith('/new-path', {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
      },
    })
  })

  it('should not perform router sync if currentLocation is not changed', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    mockAppStateService.currentLocation$.publish({
      url: 'url',
      isFirst: false,
    })

    expect(navigationSpy).not.toHaveBeenCalled()
  })

  it('should perform router sync on events topic navigated message', () => {
    mockCapabilityService.hasCapability.mockReturnValue(false)
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    changeLocation(`${deploymentPathMock}/new-path`)
    eventsTopic.publish({ type: 'navigated', payload: { url: '/url' } })

    expect(navigationSpy).toHaveBeenCalledWith('/new-path', {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
      },
    })
  })

  describe('RoutesRecognized', () => {
    it('should wrap guards on route recognized', () => {
      connector.connect()

      const childRouteConfig = {
        canActivate: [],
        canActivateChild: [],
      } as Route

      const parentRouteConfig = {
        canActivate: [],
        canDeactivate: [],
      } as Route
      const routesRecognizedMock = new RoutesRecognized(1, '', '', {
        root: {
          routeConfig: parentRouteConfig,
          children: [
            {
              routeConfig: childRouteConfig,
            },
          ],
        },
      } as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(routesRecognizedMock)

      expect(wrapGuards).toHaveBeenCalledWith(parentRouteConfig)
      expect(wrapGuards).toHaveBeenCalledWith(childRouteConfig)
    })

    it('should not wrap guards on route recognized if no route config', () => {
      connector.connect()

      const routesRecognizedMock = new RoutesRecognized(1, '', '', {
        root: {
          children: [],
        },
      } as any as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(routesRecognizedMock)

      expect(wrapGuards).not.toHaveBeenCalled()
    })
  })

  describe('GuardsCheckStart', () => {
    it('should schedule guards results gathering on GuardsCheckStart', async () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather').mockReturnValue(Promise.resolve([true, true]))
      connector.connect()

      const navigationObject = {} as GuardsNavigationState

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: navigationObject } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      mockGuardsNavigationStateController.createNavigationRequestedState.mockImplementation(
        (promise: GuardCheckPromise, state?: GuardsNavigationState | undefined) => {
          if (state) state[GUARD_CHECK_PROMISE] = promise
          return state ?? {}
        }
      )

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).toHaveBeenCalledWith({ url: guardsCheckStartMock.urlAfterRedirects })
      expect(navigationObject[GUARD_CHECK_PROMISE]).toBeDefined()
      const guardCheckResult = await navigationObject[GUARD_CHECK_PROMISE]
      expect(guardCheckResult).toBe(true)
    })

    it('should not schedule guards results gathering if no current navigation', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue(null)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is INITIAL_ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is GUARD_CHECK', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if no navigation state', async () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather').mockReturnValue(Promise.resolve([true, true]))
      connector.connect()

      const extrasObject = {} as any

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: extrasObject })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      mockGuardsNavigationStateController.createNavigationRequestedState.mockImplementation(
        (promise: GuardCheckPromise, state?: GuardsNavigationState | undefined) => {
          if (state) state[GUARD_CHECK_PROMISE] = promise
          return state ?? {}
        }
      )

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).toHaveBeenCalledWith({ url: guardsCheckStartMock.urlAfterRedirects })
      expect(extrasObject['state'][GUARD_CHECK_PROMISE]).toBeDefined()
      const guardCheckResult = await extrasObject['state'][GUARD_CHECK_PROMISE]
      expect(guardCheckResult).toBe(true)
    })
  })

  describe('GuardsCheckEnd', () => {
    it('should request navigation revert on INITIAL_ROUTER_SYNC failure', async () => {
      const spy = jest.spyOn(eventsTopic, 'publish')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, false)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).toHaveBeenCalledWith({
        type: 'revertNavigation',
      })
    })

    it('should resolve guard check on GUARD_CHECK if should activate the route', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).toHaveBeenCalledWith(guardsCheckEndMock.urlAfterRedirects, true)
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(mockRouter.url, {
        skipLocationChange: true,
        state: { [IS_ROUTER_SYNC]: true },
      })
    })

    it('should not resolve guard check on GUARD_CHECK if should not activate the route', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, false)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check on ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.ROUTER_SYNC)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check on NAVIGATION_REQUESTED', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check if no navigation state', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: {} })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
      expect(mockGuardsNavigationStateController.getMode).toHaveBeenCalledWith({})
    })

    it('should have empty navigation state if no current navigation', () => {
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue(null)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(mockGuardsNavigationStateController.getMode).toHaveBeenCalledWith({})
    })
  })
})
