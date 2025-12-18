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
  private _globalError$: GlobalErrorTopic | undefined
  get globalError$(): GlobalErrorTopic {
    this._globalError$ ??= new GlobalErrorTopic()
    return this._globalError$
  }
  set globalError$(value: GlobalErrorTopic) {
    this._globalError$ = value
  }
  private _globalLoading$: GlobalLoadingTopic | undefined
  get globalLoading$(): GlobalLoadingTopic {
    this._globalLoading$ ??= new GlobalLoadingTopic()
    return this._globalLoading$
  }
  set globalLoading$(value: GlobalLoadingTopic) {
    this._globalLoading$ = value
  }
  private _currentMfe$: CurrentMfeTopic | undefined
  get currentMfe$(): CurrentMfeTopic {
    this._currentMfe$ ??= new CurrentMfeTopic()
    return this._currentMfe$
  }
  set currentMfe$(value: CurrentMfeTopic) {
    this._currentMfe$ = value
  }
  private _currentLocation$: CurrentLocationTopic | undefined
  get currentLocation$(): CurrentLocationTopic {
    this._currentLocation$ ??= new CurrentLocationTopic()
    return this._currentLocation$
  }
  set currentLocation$(value: CurrentLocationTopic) {
    this._currentLocation$ = value
  }

  private _currentPage$: CurrentPageTopic | undefined
  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  get currentPage$(): CurrentPageTopic {
    this._currentPage$ ??= new CurrentPageTopic()
    return this._currentPage$
  }
  set currentPage$(value: CurrentPageTopic) {
    this._currentPage$ = value
  }
  _currentWorkspace$: CurrentWorkspaceTopic | undefined
  get currentWorkspace$(): CurrentWorkspaceTopic {
    this._currentWorkspace$ ??= new CurrentWorkspaceTopic()
    return this._currentWorkspace$
  }
  set currentWorkspace$(value: CurrentWorkspaceTopic) {
    this._currentWorkspace$ = value
  }
  /**
   * @deprecated Will be replaced by currentWorkspace$
   */
  get currentPortal$() {
    return this.currentWorkspace$
  }
  set currentPortal$(value: CurrentWorkspaceTopic) {
    this._currentWorkspace$ = value
  }

  /**
   * This Topic is initialized as soon as the authentication is done
   */
  private _isAuthenticated$: IsAuthenticatedTopic | undefined
  get isAuthenticated$(): IsAuthenticatedTopic {
    this._isAuthenticated$ ??= new IsAuthenticatedTopic()
    return this._isAuthenticated$
  }
  set isAuthenticated$(value: IsAuthenticatedTopic) {
    this._isAuthenticated$ = value
  }

  ngOnDestroy(): void {
    this._globalError$?.destroy()
    this._globalLoading$?.destroy()
    this._currentMfe$?.destroy()
    this._currentPage$?.destroy()
    this._currentLocation$?.destroy()
    this._currentWorkspace$?.destroy()
    this._isAuthenticated$?.destroy()
  }
}
