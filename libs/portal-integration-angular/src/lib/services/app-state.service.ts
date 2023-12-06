import { Injectable, OnDestroy } from '@angular/core'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentPortalTopic,
} from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class AppStateService implements OnDestroy {
  globalError$ = new GlobalErrorTopic()
  globalLoading$ = new GlobalLoadingTopic()
  currentMfe$ = new CurrentMfeTopic()

  /**
   *This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPage$ = new CurrentPageTopic()
  currentPortal$ = new CurrentPortalTopic()

  ngOnDestroy(): void {
    this.globalError$.destroy()
    this.globalLoading$.destroy()
    this.currentMfe$.destroy()
    this.currentPage$.destroy()
    this.currentPortal$.destroy()
  }
}
