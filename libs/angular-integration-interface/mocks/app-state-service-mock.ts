import { Injectable } from '@angular/core'
import { PageInfo, Workspace } from '@onecx/integration-interface'
// eslint-disable-next-line
import { AppStateService } from '@onecx/angular-integration-interface'
import { FakeTopic } from './fake-topic'

/**
 * @deprecated use provideAppStateServiceMock()
 */
export function provideAppServiceMock() {
  return provideAppStateServiceMock()
}

export function provideAppStateServiceMock() {
  return [{ provide: AppStateService, useClass: AppStateServiceMock }]
}

@Injectable()
export class AppStateServiceMock {
  globalError$ = new FakeTopic()
  globalLoading$ = new FakeTopic(false)
  currentMfe$ = new FakeTopic({ mountPath: '/', remoteBaseUrl: '.', baseHref: '/', shellName: 'test' })
  currentPage$ = new FakeTopic<PageInfo | undefined>(undefined)
  currentPortal$ = new FakeTopic<Workspace>({ baseUrl: '/', microfrontendRegistrations: [], portalName: 'Test portal', workspaceName: 'Test portal' })
  currentWorkspace$ = new FakeTopic<Workspace>({ baseUrl: '/', microfrontendRegistrations: [], portalName: 'Test workspace', workspaceName: 'Test workspace' })
  isAuthenticated$ = new FakeTopic<null>(null)
}
