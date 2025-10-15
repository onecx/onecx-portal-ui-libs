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
    TestBed.configureTestingModule({
      providers: [
        PermissionsStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: PermissionsTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(PermissionsStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch permissionsChanged', () => {
    const permissions = ['read', 'write']
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(permissions)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit?.()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.permissionsChanged({ permissions }))
  })

  it('should destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnInit?.()
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
