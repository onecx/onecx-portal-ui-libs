import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { RemoteComponent } from '@onecx/integration-interface'
import { RemoteComponentsService } from '@onecx/angular-integration-interface'

export function provideRemoteComponentsServiceMock() {
  return [RemoteComponentsServiceMock, { provide: RemoteComponentsService, useExisting: RemoteComponentsServiceMock }]
}
@Injectable({ providedIn: 'root' })
export class RemoteComponentsServiceMock {
  remoteComponents$ = new FakeTopic<RemoteComponent>()
}
