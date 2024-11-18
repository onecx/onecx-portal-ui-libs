import { HttpContext, HttpResponse, HttpEvent } from '@angular/common/http'
import { InjectionToken } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

export const WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER = new InjectionToken<WorkspaceConfigBffService>(
  'WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER'
)

export interface WorkspaceConfigBffService {
  getThemeFaviconByName(
    name: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<Blob>
  getThemeFaviconByName(
    name: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<HttpResponse<Blob>>
  getThemeFaviconByName(
    name: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<HttpEvent<Blob>>
  getThemeFaviconByName(
    name: string,
    observe: 'body',
    reportProgress: false,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<any>

  getThemeLogoByName(
    name: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<Blob>
  getThemeLogoByName(
    name: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<HttpResponse<Blob>>
  getThemeLogoByName(
    name: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<HttpEvent<Blob>>
  getThemeLogoByName(
    name: string,
    observe: 'body',
    reportProgress: false,
    options?: { httpHeaderAccept?: 'image/*'; context?: HttpContext }
  ): Observable<any>
}
