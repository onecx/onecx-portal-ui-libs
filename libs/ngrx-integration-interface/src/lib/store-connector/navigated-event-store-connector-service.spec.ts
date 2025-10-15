import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { NavigatedEventStoreConnectorService } from './navigated-event-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { EventsTopic, EventType, TopicEventType, CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ShellCapabilityService, Capability } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'

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

  beforeEach(() => {
    store = { dispatch: jest.fn() }
    appStateService = { currentLocation$: { asObservable: jest.fn() } }
    capabilityService = { hasCapability: jest.fn() }
    eventsTopic = new MockEventsTopic()

    jest.spyOn(eventsTopic, 'pipe').mockReturnValue(of({ type: EventType.NAVIGATED, payload: { foo: 'bar' } }))
    jest.spyOn(eventsTopic, 'subscribe')
    jest.spyOn(eventsTopic, 'destroy')
    jest.spyOn(appStateService.currentLocation$, 'asObservable').mockReturnValue(of({ foo: 'bar' }))

    TestBed.configureTestingModule({
      providers: [
        NavigatedEventStoreConnectorService,
        { provide: Store, useValue: store },
        { provide: AppStateService, useValue: appStateService },
        { provide: ShellCapabilityService, useValue: capabilityService },
        { provide: EventsTopic, useValue: eventsTopic },
      ],
    })
  })

  it('should subscribe to currentLocation$ and dispatch when capability is present', () => {
    capabilityService.hasCapability.mockReturnValue(true)
    const service = TestBed.inject(NavigatedEventStoreConnectorService)
    service.ngOnInit()
    expect(appStateService.currentLocation$.asObservable).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should subscribe to eventsTopic$ and dispatch when capability is missing', () => {
    capabilityService.hasCapability.mockReturnValue(false)
    const service = TestBed.inject(NavigatedEventStoreConnectorService)
    service.ngOnInit()
    expect(eventsTopic.pipe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should destroy eventsTopic$ on ngOnDestroy', () => {
    const service = TestBed.inject(NavigatedEventStoreConnectorService)
    service.ngOnDestroy()
    expect(eventsTopic.destroy).toHaveBeenCalled()
  })
})
