import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { NavigatedEventStoreConnectorService } from './navigated-event-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { EventsTopic, EventType } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ShellCapabilityService } from '@onecx/angular-integration-interface'
import { of } from 'rxjs'

class MockEventsTopic {
  pipe = jest.fn().mockReturnThis()
  subscribe = jest.fn()
  destroy = jest.fn()
}

describe('NavigatedEventStoreConnectorService', () => {
  let store: any
  let appStateService: any
  let capabilityService: any
  let eventsTopic: any
  let service: NavigatedEventStoreConnectorService

  beforeEach(() => {
    eventsTopic = new MockEventsTopic()
    jest.spyOn(eventsTopic, 'pipe').mockReturnValue(of({ type: EventType.NAVIGATED, payload: { foo: 'bar' } }))
    jest.spyOn(eventsTopic, 'subscribe')
    jest.spyOn(eventsTopic, 'destroy')

    capabilityService = { hasCapability: jest.fn() }
    appStateService = { currentLocation$: { asObservable: jest.fn() } }

    TestBed.configureTestingModule({
      providers: [
        NavigatedEventStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: EventsTopic, useValue: eventsTopic },
        { provide: ShellCapabilityService, useValue: capabilityService },
        { provide: AppStateService, useValue: appStateService },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(NavigatedEventStoreConnectorService)
  })

  it('should subscribe to currentLocation$ and dispatch when capability is present', () => {
    capabilityService.hasCapability.mockReturnValue(true)
    appStateService.currentLocation$.asObservable.mockReturnValue(of({ foo: 'bar' }))
    expect(appStateService.currentLocation$.asObservable).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should subscribe to eventsTopic$ and dispatch when capability is missing', () => {
    capabilityService.hasCapability.mockReturnValue(false)
    expect(eventsTopic.pipe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should destroy eventsTopic$ on ngOnDestroy', () => {
    service.ngOnDestroy()
    expect(eventsTopic.destroy).toHaveBeenCalled()
  })
})
