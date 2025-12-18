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
  set globalError$(source: GlobalErrorTopic) {
    this._globalError$ = source
  }
  private _globalLoading$: GlobalLoadingTopic | undefined
  get globalLoading$(): GlobalLoadingTopic {
    this._globalLoading$ ??= new GlobalLoadingTopic()
    return this._globalLoading$
  }
  set globalLoading$(source: GlobalLoadingTopic) {
    this._globalLoading$ = source
  }
  private _currentMfe$: CurrentMfeTopic | undefined
  get currentMfe$(): CurrentMfeTopic {
    this._currentMfe$ ??= new CurrentMfeTopic()
    return this._currentMfe$
  }
  set currentMfe$(source: CurrentMfeTopic) {
    this._currentMfe$ = source
  }
  private _currentLocation$: CurrentLocationTopic | undefined
  get currentLocation$(): CurrentLocationTopic {
    this._currentLocation$ ??= new CurrentLocationTopic()
    return this._currentLocation$
  }
  set currentLocation$(source: CurrentLocationTopic) {
    this._currentLocation$ = source
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
  set currentPage$(source: CurrentPageTopic) {
    this._currentPage$ = source
  }
  _currentWorkspace$: CurrentWorkspaceTopic | undefined
  get currentWorkspace$(): CurrentWorkspaceTopic {
    this._currentWorkspace$ ??= new CurrentWorkspaceTopic()
    return this._currentWorkspace$
  }
  set currentWorkspace$(source: CurrentWorkspaceTopic) {
    this._currentWorkspace$ = source
  }

  /**
   * This Topic is initialized as soon as the authentication is done
   */
  private _isAuthenticated$: IsAuthenticatedTopic | undefined
  get isAuthenticated$(): IsAuthenticatedTopic {
    this._isAuthenticated$ ??= new IsAuthenticatedTopic()
    return this._isAuthenticated$
  }
  set isAuthenticated$(source: IsAuthenticatedTopic) {
    this._isAuthenticated$ = source
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
