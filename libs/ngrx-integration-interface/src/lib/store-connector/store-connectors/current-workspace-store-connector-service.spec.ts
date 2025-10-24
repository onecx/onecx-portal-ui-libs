import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentWorkspaceStoreConnectorService } from './current-workspace-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Workspace } from '@onecx/integration-interface';
import { CurrentWorkspaceTopic } from '@onecx/integration-interface';
import { FakeTopic } from '@onecx/accelerator'

describe('CurrentWorkspaceStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<Workspace>
  const mockWorkspace: Workspace = {
    id: 'ws1',
    baseUrl: 'http://localhost',
    workspaceName: 'Workspace 1',
    portalName: 'Portal',
    microfrontendRegistrations: [],
  }

  beforeEach(() => {
    fakeTopic = new FakeTopic<Workspace>()
    TestBed.configureTestingModule({
      providers: [
        CurrentWorkspaceStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentWorkspaceTopic, useValue: fakeTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentWorkspaceChanged', () => {
    TestBed.inject(CurrentWorkspaceStoreConnectorService)
    fakeTopic.publish(mockWorkspace)
    const expectedAction = OneCxActions.currentWorkspaceChanged({ currentWorkspace: mockWorkspace })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const service = TestBed.inject(CurrentWorkspaceStoreConnectorService)
    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})
