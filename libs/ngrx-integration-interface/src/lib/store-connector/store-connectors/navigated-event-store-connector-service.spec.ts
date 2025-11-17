import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { NavigatedEventStoreConnectorService } from './navigated-event-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { EventType, CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { Capability } from '@onecx/angular-integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock, provideShellCapabilityServiceMock, ShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    EventsTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<any>()
    }),
  }
})

describe('NavigatedEventStoreConnectorService', () => {
  let store: any
  let service: NavigatedEventStoreConnectorService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigatedEventStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock()
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe to currentLocation$ and dispatch when capability is present', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.CURRENT_LOCATION_TOPIC])
    const mockLocationPayload: CurrentLocationTopicPayload = { url: '/test-page', isFirst: false }
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const appStateServiceMock = TestBed.inject(AppStateServiceMock)
    
    appStateServiceMock.currentLocation$.publish(mockLocationPayload)
    
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: mockLocationPayload }))
  })

  it('should subscribe to eventsTopic$ and dispatch when capability is missing', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])
    const mockEventPayload = { foo: 'bar' }
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const eventsTopic = (service as any).eventsTopic$ as FakeTopic<any>
    
    eventsTopic.publish({ type: EventType.NAVIGATED, payload: mockEventPayload })
    
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: mockEventPayload }))
  })

  it('should destroy eventsTopic$ on ngOnDestroy', () => {
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const eventsTopic = (service as any).eventsTopic$ as FakeTopic<any>
    const destroySpy = jest.spyOn(eventsTopic, 'destroy')
    
    service.ngOnDestroy()
    
    expect(destroySpy).toHaveBeenCalled()
  })
})
