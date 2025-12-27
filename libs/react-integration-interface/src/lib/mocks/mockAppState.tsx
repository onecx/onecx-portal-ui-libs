import {
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  GlobalErrorTopic,
  GlobalLoadingTopic,
  IsAuthenticatedTopic,
  Workspace,
} from '@onecx/integration-interface';
import { AppStateProvider } from '../contexts/appStateContext';
import { FakeTopic } from './fake-topic';
import { FC, ReactNode } from 'react';

const mockWorkspace: Workspace = {
  id: 'workspace-123',
  displayName: 'Mock Workspace',
  portalName: 'mock-portal',
  workspaceName: 'mock-workspace',
  description: 'A mock workspace for testing',
  themeId: 'theme-1',
  themeName: 'Light Theme',
  footerLabel: 'Footer Mock',
  homePage: '/home',
  baseUrl: 'http://example.com',
  companyName: 'Mock Company',
  portalRoles: ['admin', 'user'],
  microfrontendRegistrations: [],
  logoUrl: 'http://example.com/logo.png',
  logoSmallImageUrl: 'http://example.com/logo-small.png',
  routes: [
    {
      appId: 'onecx-workspace-ui',
      productName: 'onecx-workspace',
      baseUrl: 'http://example.com/workspace/baseurl',
      endpoints: [
        { name: 'details', path: '/details/{id}' },
        { name: 'edit', path: '[[details]]' },
        { name: 'change', path: '[[edit]]' },
      ],
    },
  ],
};

export const mockCurrentWorkspace$ = new FakeTopic(mockWorkspace);

export interface AppStateContextProps {
  globalError$: GlobalErrorTopic;
  globalLoading$: GlobalLoadingTopic;
  currentMfe$: CurrentMfeTopic;
  currentPage$: CurrentPageTopic;
  currentWorkspace$: CurrentWorkspaceTopic;
  currentPortal$: CurrentWorkspaceTopic;
  isAuthenticated$: IsAuthenticatedTopic;
}

export const mockAppStateContext: Partial<AppStateContextProps> = {
  globalError$: new FakeTopic(''),
  globalLoading$: new FakeTopic(false),
  currentMfe$: new FakeTopic({
    appId: '',
    baseHref: '',
    mountPath: '',
    productName: '',
    remoteBaseUrl: '',
    shellName: '',
  }),
  // can't mock because of the private props
  currentPage$: new FakeTopic({ path: '' }) as unknown as CurrentPageTopic,
  currentWorkspace$: mockCurrentWorkspace$,
  currentPortal$: mockCurrentWorkspace$,
  isAuthenticated$: new FakeTopic(),
};

export const MockAppStateProvider: FC<{
  children: ReactNode;
  mockAppState?: Partial<AppStateContextProps> | undefined;
}> = ({ children, mockAppState }) => (
  <AppStateProvider value={mockAppState || mockAppStateContext}>
    {children}
  </AppStateProvider>
);
