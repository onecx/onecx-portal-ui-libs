import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentMfeStoreConnectorService } from './current-mfe-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { MfeInfo } from '@onecx/integration-interface';
import { CurrentMfeTopic } from '@onecx/integration-interface';

describe('CurrentMfeStoreConnectorService', () => {
  let service: CurrentMfeStoreConnectorService
  let store: Store
  let mockTopic: any
  const mockMfe: MfeInfo = {
    mountPath: '/mfe1',
    remoteBaseUrl: 'http://localhost:4201',
    baseHref: '/mfe1/',
    shellName: 'shell',
    appId: 'mfe1',
    productName: 'MFE 1',
  }

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentMfeTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(mockMfe)
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        CurrentMfeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentMfeTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(CurrentMfeStoreConnectorService)
  })

  it('should subscribe and dispatch currentMfeChanged', () => {
    const expectedAction = OneCxActions.currentMfeChanged({ currentMfe: mockMfe })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
