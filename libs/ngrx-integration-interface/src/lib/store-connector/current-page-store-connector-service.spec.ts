import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentPageStoreConnectorService } from './current-page-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { PageInfo } from '../../../../integration-interface/src/lib/topics/current-page/v1/page-info.model'
import { CurrentPageTopic } from '../../../../integration-interface/src/lib/topics/current-page/v1/current-page.topic'

describe('CurrentPageStoreConnectorService', () => {
  let service: CurrentPageStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentPageTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock
    TestBed.configureTestingModule({
      providers: [
        CurrentPageStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentPageTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(CurrentPageStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch currentPageChanged', () => {
    const currentPage: PageInfo = { path: '/bar' }
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(currentPage)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit()
    expect(mockTopic.pipe).toHaveBeenCalled()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.currentPageChanged({ currentPage }))
  })

  it('should destroy on ngOnDestroy', () => {
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
