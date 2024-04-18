import { Injectable, OnDestroy } from '@angular/core'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
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
  currentWorkspace$ = new CurrentWorkspaceTopic()
  
  /**
   * @deprecated Will be replaced by currentWorkspace$
   */
  get currentPortal$() {
    return this.currentWorkspace$
  }
  set currentPortal$(value: CurrentWorkspaceTopic) {
    this.currentWorkspace$ = value
  }

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
    this.currentWorkspace$.destroy()
    this.isAuthenticated$.destroy()
  }
}
