import { TestBed } from '@angular/core/testing'
import { OnecxRoute, wrapGuards, WRAPPED_GUARD_TAG } from './wrap-guards.utils'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router'
import { Component, Injector, runInInjectionContext, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

class MockGuardsWrapper {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }
}

describe('wrapGuards', () => {
  let mockRoute: OnecxRoute

  beforeEach(() => {
    mockRoute = {
      path: 'test',
      canActivate: [],
      canDeactivate: [],
      canActivateChild: [],
      children: [],
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivateGuardsWrapper, useClass: MockGuardsWrapper },
        {
          provide: DeactivateGuardsWrapper,
          useClass: MockGuardsWrapper,
        },
      ],
    })
  })

  it('should wrap canActivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canDeactivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canDeactivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canDeactivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canDeactivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canActivateChild guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivateChild = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivateChild guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivateChild = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should recursively wrap guards for child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should force guard run for the route', () => {
    mockRoute.runGuardsAndResolvers = 'paramsChange'

    wrapGuards(mockRoute)

    expect(mockRoute.runGuardsAndResolvers).toBe('always')
  })

  it('should handle empty route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = []
    mockRoute.canDeactivate = []
    mockRoute.canActivateChild = []

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle undefined route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = undefined
    mockRoute.canDeactivate = undefined
    mockRoute.canActivateChild = undefined

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle multiple child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    const secondChildRoute = {
      path: 'second-child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute, secondChildRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    expect((secondChildRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should react to dynamically added guards', () => {
    const mockGuard = jest.fn()
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard, mockGuard]
    mockRoute.canDeactivate = [wrappedGuard, mockGuard]
    mockRoute.canActivateChild = [wrappedGuard, mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap guards based on saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add 2nd guard dynamically
    const newMockGuard = jest.fn()
    mockRoute.canActivate.push(newMockGuard)
    mockRoute.canDeactivate.push(newMockGuard)
    mockRoute.canActivateChild.push(newMockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()
  })

  it('should not duplicate guards in saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add the same guard again
    mockRoute.canActivate.push(mockGuard)
    mockRoute.canDeactivate.push(mockGuard)
    mockRoute.canActivateChild.push(mockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()
  })
})
