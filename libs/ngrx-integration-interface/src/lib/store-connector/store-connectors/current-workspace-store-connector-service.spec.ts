import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentWorkspaceStoreConnectorService } from './current-workspace-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Workspace } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentWorkspaceStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockWorkspace: Workspace = {
    id: 'ws1',
    baseUrl: 'http://localhost',
    workspaceName: 'Workspace 1',
    portalName: 'Portal',
    microfrontendRegistrations: [],
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentWorkspaceStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentWorkspaceChanged', () => {
    TestBed.inject(CurrentWorkspaceStoreConnectorService)
    appStateServiceMock.currentWorkspace$.publish(mockWorkspace)
    const expectedAction = OneCxActions.currentWorkspaceChanged({ currentWorkspace: mockWorkspace })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})
