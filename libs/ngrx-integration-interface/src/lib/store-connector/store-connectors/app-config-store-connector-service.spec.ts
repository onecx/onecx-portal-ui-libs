import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { AppConfigStoreConnectorService } from './app-config-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface'
import { provideAppConfigServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('AppConfigStoreConnectorService', () => {
  let store: Store
  let appConfigService: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigStoreConnectorService,
        provideAppConfigServiceMock(),
        { provide: Store, useValue: { dispatch: jest.fn() } },
      ],
    })
    store = TestBed.inject(Store)
    appConfigService = TestBed.inject(AppConfigService)
    jest.spyOn(store, 'dispatch')
    appConfigService.setProperty('key', 'test')
    TestBed.inject(AppConfigStoreConnectorService)
  })

  it('should subscribe and dispatch appConfigChanged', () => {
    const expectedAction = OneCxActions.appConfigChanged({ appConfig: { key: 'test' } })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
