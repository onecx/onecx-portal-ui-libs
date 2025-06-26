import { Injectable } from '@angular/core'
import { RemoteComponentsInfo } from '@onecx/integration-interface'
import { RemoteComponentsService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideRemoteComponentsServiceMock() {
  return [RemoteComponentsServiceMock, { provide: RemoteComponentsService, useExisting: RemoteComponentsServiceMock }]
}
@Injectable({ providedIn: 'root' })
export class RemoteComponentsServiceMock {
  remoteComponents$ = new FakeTopic<RemoteComponentsInfo>()
}
