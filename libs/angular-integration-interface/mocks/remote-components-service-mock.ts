import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { RemoteComponent } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class RemoteComponentsServiceMock {
  remoteComponents$ = new FakeTopic<RemoteComponent>()
}
