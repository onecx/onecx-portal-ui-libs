import { Injectable, OnDestroy } from '@angular/core'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  IsAuthenticatedTopic,
  CurrentLocationTopic,
} from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class AppStateService implements OnDestroy {
  globalError$ = new GlobalErrorTopic()
  globalLoading$ = new GlobalLoadingTopic()
  currentMfe$ = new CurrentMfeTopic()
  currentLocation$ = new CurrentLocationTopic()

  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPage$ = new CurrentPageTopic()
  currentWorkspace$ = new CurrentWorkspaceTopic()

  /**
   * This Topic is initialized as soon as the authentication is done
   */
  isAuthenticated$ = new IsAuthenticatedTopic()

  ngOnDestroy(): void {
    this.globalError$.destroy()
    this.globalLoading$.destroy()
    this.currentMfe$.destroy()
    this.currentPage$.destroy()
    this.currentLocation$.destroy()
    this.currentWorkspace$.destroy()
    this.isAuthenticated$.destroy()
  }
}
