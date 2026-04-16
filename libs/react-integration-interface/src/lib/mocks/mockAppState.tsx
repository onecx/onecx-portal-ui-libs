import type {
  CurrentLocationTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  GlobalErrorTopic,
  GlobalLoadingTopic,
  IsAuthenticatedTopic,
  Workspace,
} from '@onecx/integration-interface'
import { AppStateProvider } from '../contexts/appStateContext'
import type { FC, ReactNode } from 'react'
import { FakeTopic } from '@onecx/accelerator'

const mockPortalWorkspace: Workspace = {
  baseUrl: '/',
  microfrontendRegistrations: [],
  portalName: 'Test portal',
  workspaceName: 'Test portal',
}

const mockWorkspace: Workspace = {
  baseUrl: '/',
  microfrontendRegistrations: [],
  portalName: 'Test workspace',
  workspaceName: 'Test workspace',
}

export const mockCurrentWorkspace$ = new FakeTopic(mockWorkspace) as unknown as CurrentWorkspaceTopic

export interface AppStateContextProps {
  globalError$: GlobalErrorTopic
  globalLoading$: GlobalLoadingTopic
  currentMfe$: CurrentMfeTopic
  currentPage$: CurrentPageTopic
  currentWorkspace$: CurrentWorkspaceTopic
  currentPortal$: CurrentWorkspaceTopic
  currentLocation$: CurrentLocationTopic
  isAuthenticated$: IsAuthenticatedTopic
}

export const mockAppStateContext: Partial<AppStateContextProps> = {
  globalError$: new FakeTopic() as unknown as GlobalErrorTopic,
  globalLoading$: new FakeTopic(false) as unknown as GlobalLoadingTopic,
  currentMfe$: new FakeTopic({
    mountPath: '/',
    remoteBaseUrl: '.',
    baseHref: '/',
    shellName: 'test',
    appId: 'test',
    productName: 'test',
  }) as unknown as CurrentMfeTopic,
  currentPage$: new FakeTopic(undefined) as unknown as CurrentPageTopic,
  currentPortal$: new FakeTopic(mockPortalWorkspace) as unknown as CurrentWorkspaceTopic,
  currentWorkspace$: mockCurrentWorkspace$,
  currentLocation$: new FakeTopic({ url: '/', isFirst: true }) as unknown as CurrentLocationTopic,
  isAuthenticated$: new FakeTopic(null) as unknown as IsAuthenticatedTopic,
}

export const MockAppStateProvider: FC<{
  children: ReactNode
  mockAppState?: Partial<AppStateContextProps> | undefined
}> = ({ children, mockAppState }) => (
  <AppStateProvider value={mockAppState || mockAppStateContext}>{children}</AppStateProvider>
)
