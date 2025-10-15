import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { AppConfigStoreConnectorService } from './app-config-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { AppConfigService } from '../../../../angular-integration-interface/src/lib/services/app-config-service'

class MockAppConfigService {
  config$ = { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() as jest.Mock }
}

describe('AppConfigStoreConnectorService', () => {
  let service: AppConfigStoreConnectorService
  let store: Store
  let mockAppConfigService: MockAppConfigService

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService()
    TestBed.configureTestingModule({
      providers: [
        AppConfigStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    })
    service = TestBed.inject(AppConfigStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch appConfigChanged', () => {
    const appConfig = { foo: 'bar' }
    mockAppConfigService.config$.subscribe.mockImplementation((cb: any) => {
      cb(appConfig)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit()
    expect(mockAppConfigService.config$.pipe).toHaveBeenCalled()
    expect(mockAppConfigService.config$.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.appConfigChanged({ appConfig }))
  })
})
