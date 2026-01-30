import { GuardResultResponse, GuardsGatherer } from './guards-gatherer.service'
import { Router } from '@angular/router'
import { TestBed } from '@angular/core/testing'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { GUARD_CHECK } from '../model/guard-navigation.model'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')

  return {
    ...actual,
    Gatherer: jest.fn().mockImplementation(() => ({
      gather: jest.fn(),
      destroy: jest.fn(),
    })),
  }
})

describe('GuardsGatherer', () => {
  let service: GuardsGatherer
  const routerMock = { navigateByUrl: jest.fn() }
  const guardsNavigationStateController = {
    createGuardCheckState: jest.fn().mockReturnValue({}),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuardsGatherer,
        { provide: Router, useValue: routerMock },
        { provide: GuardsNavigationStateController, useValue: guardsNavigationStateController },
      ],
    })

    service = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should destroy guardsGatherer on destroy', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.ngOnDestroy()

    expect(destroySpy).toHaveBeenCalled()
  })

  it('should activate the gatherer', () => {
    service.activate()
    expect(Gatherer).toHaveBeenCalledWith('GuardGatherer', 1, expect.any(Function))
  })

  it('should destroy the gatherer on deactivate', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.deactivate()
    expect(destroySpy).toHaveBeenCalled()
  })

  it('should gather guard results', async () => {
    service.activate()
    const request = { url: '/test' }
    const response = [true, true]

    service['guardsGatherer']!.gather = jest.fn().mockResolvedValue(response)

    const result = await service.gather(request)

    expect(service['guardsGatherer']!.gather).toHaveBeenCalledWith(request)
    expect(result).toBe(response)
  })

  it('should throw error if gather is called before activation', async () => {
    const request = { url: '/test' }

    expect(() => service.gather(request)).toThrow('Guards gatherer is not active')
  })

  it('should call executeGuardsCallback on gather', async () => {
    service.activate()
    const request = { url: '/test' }
    const navigateSpy = jest.spyOn(routerMock, 'navigateByUrl')
    guardsNavigationStateController.createGuardCheckState.mockReturnValue({ [GUARD_CHECK]: true })

    // Mock the callback function call
    service['executeGuardsCallback'](request)

    expect(navigateSpy).toHaveBeenCalledWith(request.url, {
      state: guardsNavigationStateController.createGuardCheckState(),
      onSameUrlNavigation: 'reload',
    })
    expect(service['guardsChecks']).toBeDefined()
    expect(service['guardsChecks']!.get(request.url)).toBeDefined()
  })

  it('should throw an error if executeGuardsCallback is called when not active', async () => {
    await expect(() => service['executeGuardsCallback']({ url: '/test' })).rejects.toThrow(
      'Guards gatherer is not active'
    )
  })

  it('should resolve route with guard result response', () => {
    service.activate()
    expect(service['guardsChecks']).toBeDefined()
    const routeUrl = '/test'
    const promiseToResolve = new Promise<GuardResultResponse>((resolve) =>
      service['guardsChecks']!.set(routeUrl, resolve)
    )
    expect(service['guardsChecks']!.get(routeUrl)).toBeDefined()

    service.resolveRoute(routeUrl, true)
    expect(promiseToResolve).resolves.toBe(true)
    expect(service['guardsChecks']!.get(routeUrl)).toBeUndefined()
  })

  it('should throw an error if resolveRoute is called when not active', () => {
    expect(() => service.resolveRoute('/test', true)).toThrow('Guards gatherer is not active')
  })
})
