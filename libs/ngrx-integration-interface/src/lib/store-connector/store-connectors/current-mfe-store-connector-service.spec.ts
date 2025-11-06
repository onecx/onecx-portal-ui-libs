import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentMfeStoreConnectorService } from './current-mfe-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { MfeInfo } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentMfeStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockMfe: MfeInfo = {
    mountPath: '/mfe1',
    remoteBaseUrl: 'http://localhost:4201',
    baseHref: '/mfe1/',
    shellName: 'shell',
    appId: 'mfe1',
    productName: 'MFE 1',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentMfeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentMfeChanged', () => {
    TestBed.inject(CurrentMfeStoreConnectorService)
    
    appStateServiceMock.currentMfe$.publish(mockMfe)
    
    const expectedAction = OneCxActions.currentMfeChanged({ currentMfe: mockMfe })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
