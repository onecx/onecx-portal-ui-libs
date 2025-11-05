import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { NavigatedEventStoreConnectorService } from './navigated-event-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { EventsTopic, EventType } from '@onecx/integration-interface'
import { Capability } from '@onecx/angular-integration-interface'
import { of } from 'rxjs'
import { provideAppStateServiceMock, provideShellCapabilityServiceMock, ShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { FakeTopic } from '@onecx/accelerator'

describe('NavigatedEventStoreConnectorService', () => {
  let store: any
  let eventsTopic: FakeTopic<any>
  let service: NavigatedEventStoreConnectorService

  beforeEach(() => {
    eventsTopic = new FakeTopic<any>()
    jest.spyOn(eventsTopic, 'pipe').mockReturnValue(of({ type: EventType.NAVIGATED, payload: { foo: 'bar' } }))
    jest.spyOn(eventsTopic, 'subscribe')
    jest.spyOn(eventsTopic, 'destroy')

    TestBed.configureTestingModule({
      providers: [
        NavigatedEventStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: EventsTopic, useValue: eventsTopic },
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock()
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(NavigatedEventStoreConnectorService)
  })

  it('should subscribe to currentLocation$ and dispatch when capability is present', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])
    eventsTopic.publish({ foo: 'bar' })
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should subscribe to eventsTopic$ and dispatch when capability is missing', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])
    eventsTopic.publish({ type: EventType.NAVIGATED, payload: { foo: 'bar' } })
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: { foo: 'bar' } }))
  })

  it('should destroy eventsTopic$ on ngOnDestroy', () => {
    service.ngOnDestroy()
    expect(eventsTopic.destroy).toHaveBeenCalled()
  })
})
