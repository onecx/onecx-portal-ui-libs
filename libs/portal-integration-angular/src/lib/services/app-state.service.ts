import { Injectable, OnDestroy } from '@angular/core'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentPortalTopic,
  IsAuthenticatedTopic,
} from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class AppStateService implements OnDestroy {
  globalError$ = new GlobalErrorTopic()
  globalLoading$ = new GlobalLoadingTopic()
  currentMfe$ = new CurrentMfeTopic()

  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPage$ = new CurrentPageTopic()
  currentPortal$ = new CurrentPortalTopic()

  /**
   * This Topic is initialized as soon as the authentication is done
   */
  isAuthenticated$ = new IsAuthenticatedTopic()

  ngOnDestroy(): void {
    this.globalError$.destroy()
    this.globalLoading$.destroy()
    this.currentMfe$.destroy()
    this.currentPage$.destroy()
    this.currentPortal$.destroy()
    this.isAuthenticated$.destroy()
  }
}
