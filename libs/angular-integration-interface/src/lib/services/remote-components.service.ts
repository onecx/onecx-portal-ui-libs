import { Injectable, OnDestroy } from '@angular/core'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class RemoteComponentsService implements OnDestroy {
  _remoteComponents$: RemoteComponentsTopic | undefined
  get remoteComponents$() {
    this._remoteComponents$ ??= new RemoteComponentsTopic()
    return this._remoteComponents$
  }
  set remoteComponents$(source: RemoteComponentsTopic) {
    this._remoteComponents$ = source
  }

  ngOnDestroy(): void {
    this._remoteComponents$?.destroy()
  }
}
