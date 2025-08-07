import { Injectable } from '@angular/core'
import { CurrentLocationTopicPayload, MfeInfo, PageInfo, Workspace } from '@onecx/integration-interface'
// eslint-disable-next-line
import { AppStateService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideAppStateServiceMock() {
  return [AppStateServiceMock, { provide: AppStateService, useExisting: AppStateServiceMock }]
}

@Injectable()
export class AppStateServiceMock {
  globalError$ = new FakeTopic()
  globalLoading$ = new FakeTopic(false)
  currentMfe$ = new FakeTopic<MfeInfo>({
    mountPath: '/',
    remoteBaseUrl: '.',
    baseHref: '/',
    shellName: 'test',
    appId: 'test',
    productName: 'test',
  })
  currentPage$ = new FakeTopic<PageInfo | undefined>(undefined)
  currentPortal$ = new FakeTopic<Workspace>({
    baseUrl: '/',
    microfrontendRegistrations: [],
    portalName: 'Test portal',
    workspaceName: 'Test portal',
  })
  currentWorkspace$ = new FakeTopic<Workspace>({
    baseUrl: '/',
    microfrontendRegistrations: [],
    portalName: 'Test workspace',
    workspaceName: 'Test workspace',
  })
  currentLocation$ = new FakeTopic<CurrentLocationTopicPayload>({
    url: '/',
    isFirst: true,
  })
  isAuthenticated$ = new FakeTopic<null>(null)
}
