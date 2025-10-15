import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentMfeStoreConnectorService } from './current-mfe-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { MfeInfo } from '../../../../integration-interface/src/lib/topics/current-mfe/v1/mfe-info.model'
import { CurrentMfeTopic } from '../../../../integration-interface/src/lib/topics/current-mfe/v1/current-mfe.topic'

describe('CurrentMfeStoreConnectorService', () => {
  let service: CurrentMfeStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentMfeTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    TestBed.configureTestingModule({
      providers: [
        CurrentMfeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentMfeTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(CurrentMfeStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch currentMfeChanged', () => {
    const currentMfe: MfeInfo = { mountPath: '/foo', remoteBaseUrl: '', baseHref: '', shellName: '', appId: '', productName: '' }
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(currentMfe)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit?.()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.currentMfeChanged({ currentMfe }))
  })

  it('should destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnInit?.()
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
