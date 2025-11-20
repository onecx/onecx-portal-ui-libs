import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { PermissionsStoreConnectorService } from './permissions-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { UserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { UserService } from '@onecx/angular-integration-interface'

describe('PermissionsStoreConnectorService', () => {
  let store: Store
  let userServiceMock: UserServiceMock
  const mockPermissions = ['perm1', 'perm2']

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionsStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        UserServiceMock,
        { provide: UserService, useExisting: UserServiceMock },
      ],
    })
    store = TestBed.inject(Store)
    userServiceMock = TestBed.inject(UserServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch permissionsChanged', () => {
    TestBed.inject(PermissionsStoreConnectorService)
    userServiceMock.permissionsTopic$.publish(mockPermissions)
    const expectedAction = OneCxActions.permissionsChanged({ permissions: mockPermissions })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
