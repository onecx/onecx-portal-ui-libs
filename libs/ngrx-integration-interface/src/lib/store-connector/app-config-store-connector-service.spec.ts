import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { AppConfigStoreConnectorService } from './app-config-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface';

class MockAppConfigService {
  config$ = { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() as jest.Mock }
}

describe('AppConfigStoreConnectorService', () => {
  let store: Store
  let mockAppConfigService: MockAppConfigService

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService()
    mockAppConfigService.config$.subscribe.mockImplementation((cb: any) => {
      cb({ foo: 'bar' })
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        AppConfigStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch appConfigChanged', () => {
    const expectedAction = OneCxActions.appConfigChanged({ appConfig: { foo: 'bar' } })
    expect(mockAppConfigService.config$.pipe).toHaveBeenCalled()
    expect(mockAppConfigService.config$.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
