import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentMfeStoreConnectorService } from './current-mfe-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { CurrentMfeTopic, MfeInfo } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

describe('CurrentMfeStoreConnectorService', () => {
  let service: CurrentMfeStoreConnectorService
  let store: Store
  let fakeTopic: FakeTopic<MfeInfo>
  const mockMfe: MfeInfo = {
    mountPath: '/mfe1',
    remoteBaseUrl: 'http://localhost:4201',
    baseHref: '/mfe1/',
    shellName: 'shell',
    appId: 'mfe1',
    productName: 'MFE 1',
  }

  beforeEach(() => {
    fakeTopic = new FakeTopic<MfeInfo>()
    TestBed.configureTestingModule({
      providers: [
        CurrentMfeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentMfeTopic, useValue: fakeTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(CurrentMfeStoreConnectorService)
    fakeTopic.publish(mockMfe)
  })

  it('should subscribe and dispatch currentMfeChanged', () => {
    const expectedAction = OneCxActions.currentMfeChanged({ currentMfe: mockMfe })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})
