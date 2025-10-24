import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentPageStoreConnectorService } from './current-page-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { CurrentPageTopic, PageInfo } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

describe('CurrentPageStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<PageInfo>
  const mockPage: PageInfo = { path: '/path' }

  beforeEach(() => {
    // Arrange
    fakeTopic = new FakeTopic<PageInfo>()
    TestBed.configureTestingModule({
      providers: [
        CurrentPageStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentPageTopic, useValue: fakeTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentPageChanged', () => {
    // Act
    TestBed.inject(CurrentPageStoreConnectorService)
    fakeTopic.publish(mockPage)
    // Assert
    const expectedAction = OneCxActions.currentPageChanged({ currentPage: mockPage })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    // Act
    const service = TestBed.inject(CurrentPageStoreConnectorService)
    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    // Assert
    expect(destroySpy).toHaveBeenCalled()
  })
})
