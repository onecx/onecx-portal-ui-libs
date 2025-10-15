import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { PermissionsStoreConnectorService } from './permissions-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { PermissionsTopic } from '@onecx/integration-interface'

describe('PermissionsStoreConnectorService', () => {
  let service: PermissionsStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new PermissionsTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(['perm1', 'perm2'])
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        PermissionsStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: PermissionsTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(PermissionsStoreConnectorService)
  })

  it('should subscribe and dispatch permissionsChanged', () => {
    const expectedAction = OneCxActions.permissionsChanged({ permissions: ['perm1', 'perm2'] })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
