import { Injectable, OnDestroy } from '@angular/core'
import { GlobalErrorTopic, GlobalLoadingTopic, CurrentMfeTopic, CurrentPageTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class AppStateService implements OnDestroy {
  globalErrorTopic$ = new GlobalErrorTopic()
  globalLoadingTopic$ = new GlobalLoadingTopic()
  currentMfeTopic$ = new CurrentMfeTopic()

  /**
   *This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPageTopic$ = new CurrentPageTopic()

  ngOnDestroy(): void {
    this.globalErrorTopic$.destroy()
    this.globalLoadingTopic$.destroy()
    this.currentMfeTopic$.destroy()
    this.currentPageTopic$.destroy()
  }
}
