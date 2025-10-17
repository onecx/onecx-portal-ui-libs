import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentWorkspaceStoreConnectorService } from './current-workspace-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Workspace } from '@onecx/integration-interface';
import { CurrentWorkspaceTopic } from '@onecx/integration-interface';

describe('CurrentWorkspaceStoreConnectorService', () => {
  let service: CurrentWorkspaceStoreConnectorService
  let store: Store
  let mockTopic: any
  const mockWorkspace = {
    id: 'ws1',
    name: 'Workspace 1',
    baseUrl: 'http://localhost',
    workspaceName: 'Workspace 1',
    portalName: 'Portal',
    microfrontendRegistrations: [],
  } as Workspace

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentWorkspaceTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(mockWorkspace)
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        CurrentWorkspaceStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentWorkspaceTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(CurrentWorkspaceStoreConnectorService)
  })

  it('should subscribe and dispatch currentWorkspaceChanged', () => {
    const expectedAction = OneCxActions.currentWorkspaceChanged({ currentWorkspace: mockWorkspace })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
