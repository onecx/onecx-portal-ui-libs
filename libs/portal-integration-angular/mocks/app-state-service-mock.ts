import { Injectable } from '@angular/core'
import { PageInfo, Portal } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/portal-integration-angular'
import { FakeTopic } from './fake-topic'

export function provideAppServiceMock() {
  return [{ provide: AppStateService, useClass: AppStateServiceMock }]
}

@Injectable()
export class AppStateServiceMock {
  globalError$ = new FakeTopic()
  globalLoading$ = new FakeTopic(false)
  currentMfe$ = new FakeTopic({ mountPath: '/', remoteBaseUrl: '.', baseHref: '/', shellName: 'test' })
  currentPage$ = new FakeTopic<PageInfo | undefined>(undefined)
  currentPortal$ = new FakeTopic<Portal>({ baseUrl: '/', microfrontendRegistrations: [], portalName: 'Test portal' })
  isAuthenticated$ = new FakeTopic<null>(null)
}
