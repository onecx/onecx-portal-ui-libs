import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { ConfigurationStoreConnectorService } from './configuration-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { ConfigurationService } from '@onecx/angular-integration-interface'

describe('ConfigurationStoreConnectorService', () => {
  let store: Store
  let mockConfigService: any

  beforeEach(() => {
    mockConfigService = { 
      getConfig: jest.fn().mockReturnValue({ foo: 'bar' }),
      isInitialized: Promise.resolve()
    }
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationService, useValue: mockConfigService },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should get config and dispatch configChanged', async () => {
    TestBed.inject(ConfigurationStoreConnectorService)
    
    await Promise.resolve()
    
    const expectedAction = OneCxActions.configChanged({ config: { foo: 'bar' } })
    expect(mockConfigService.getConfig).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
