import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { PermissionsStoreConnectorService } from './permissions-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { PermissionsTopic } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

describe('PermissionsStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<string[]>
  const mockPermissions = ['perm1', 'perm2']

  beforeEach(() => {
    fakeTopic = new FakeTopic<string[]>()
    TestBed.configureTestingModule({
      providers: [
        PermissionsStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: PermissionsTopic, useValue: fakeTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch permissionsChanged', () => {
    TestBed.inject(PermissionsStoreConnectorService)
    fakeTopic.publish(mockPermissions)
    const expectedAction = OneCxActions.permissionsChanged({ permissions: mockPermissions })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const service = TestBed.inject(PermissionsStoreConnectorService)
    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})
