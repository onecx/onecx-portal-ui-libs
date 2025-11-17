import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentPageStoreConnectorService } from './current-page-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { PageInfo } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentPageStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockPage: PageInfo = { path: '/path' }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentPageStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentPageChanged', () => {
    TestBed.inject(CurrentPageStoreConnectorService)
    appStateServiceMock.currentPage$.publish(mockPage)
    
    const expectedAction = OneCxActions.currentPageChanged({ currentPage: mockPage })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
