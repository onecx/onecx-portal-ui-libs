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
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(ConfigurationStoreConnectorService)
    store = TestBed.inject(Store)
    service.config$ = mockTopic
  })

  it('should subscribe on ngOnInit and dispatch configChanged', () => {
    const config = { foo: 'bar' }
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(config)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.configChanged({ config }))
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnInit()
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
