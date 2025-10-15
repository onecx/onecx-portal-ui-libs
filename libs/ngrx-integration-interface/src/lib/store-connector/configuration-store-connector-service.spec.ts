import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { ConfigurationStoreConnectorService } from './configuration-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { ConfigurationTopic } from '@onecx/integration-interface'

describe('ConfigurationStoreConnectorService', () => {
  let service: ConfigurationStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new ConfigurationTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb({ foo: 'bar' })
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(ConfigurationStoreConnectorService)
  })

  it('should subscribe and dispatch configChanged', () => {
    const expectedAction = OneCxActions.configChanged({ config: { foo: 'bar' } })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
