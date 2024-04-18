import { Injectable, OnDestroy } from '@angular/core'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class RemoteComponentsService implements OnDestroy {
  remoteComponents$ = new RemoteComponentsTopic()

  ngOnDestroy(): void {
    this.remoteComponents$.destroy()
  }
}
