import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentWorkspaceStoreConnectorService } from './current-workspace-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { Workspace } from '../../../../integration-interface/src/lib/topics/current-workspace/v1/workspace.model'
import { CurrentWorkspaceTopic } from '../../../../integration-interface/src/lib/topics/current-workspace/v1/current-workspace.topic'

describe('CurrentWorkspaceStoreConnectorService', () => {
  let service: CurrentWorkspaceStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentWorkspaceTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    TestBed.configureTestingModule({
      providers: [
        CurrentWorkspaceStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentWorkspaceTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(CurrentWorkspaceStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch currentWorkspaceChanged', () => {
    const currentWorkspace: Workspace = {
      baseUrl: '',
      workspaceName: '',
      portalName: '',
      microfrontendRegistrations: [],
    }
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(currentWorkspace)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit?.()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.currentWorkspaceChanged({ currentWorkspace }))
  })

  it('should destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnInit?.()
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
