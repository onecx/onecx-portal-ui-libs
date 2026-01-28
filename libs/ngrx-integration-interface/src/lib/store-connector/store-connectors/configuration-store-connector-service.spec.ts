import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { ConfigurationStoreConnectorService } from './configuration-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { ConfigurationService } from '@onecx/angular-integration-interface'

describe('ConfigurationStoreConnectorService', () => {
  let store: Store
  let mockConfigService: any

  beforeEach(() => {
    mockConfigService = { getConfig: jest.fn().mockResolvedValue({ foo: 'bar' }) }
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationService, useValue: mockConfigService },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    TestBed.inject(ConfigurationStoreConnectorService)
  })

  it('should get config and dispatch configChanged', async () => {
    const expectedAction = OneCxActions.configChanged({ config: { foo: 'bar' } })

    // wait for async announcements
    await Promise.resolve()
    expect(mockConfigService.getConfig).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
