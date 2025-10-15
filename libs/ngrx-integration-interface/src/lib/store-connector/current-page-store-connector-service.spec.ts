import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentPageStoreConnectorService } from './current-page-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { PageInfo } from '@onecx/integration-interface';
import { CurrentPageTopic } from '@onecx/integration-interface';

describe('CurrentPageStoreConnectorService', () => {
  let service: CurrentPageStoreConnectorService
  let store: Store
  let mockTopic: any
  const mockPage: PageInfo = { path: '/path' }

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentPageTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(mockPage)
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        CurrentPageStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentPageTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(CurrentPageStoreConnectorService)
  })

  it('should subscribe and dispatch currentPageChanged', () => {
    const expectedAction = OneCxActions.currentPageChanged({ currentPage: mockPage })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
