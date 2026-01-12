import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, from, mergeMap } from 'rxjs'
import { AuthProxyService } from './auth-proxy.service'
import { AppStateService } from '@onecx/angular-integration-interface'

const WHITELIST = ['assets']

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService = inject(AuthProxyService)
  private appStateService = inject(AppStateService)

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skip = WHITELIST.some((str) => request.url.includes(str))
    if (skip) {
      return next.handle(request)
    }

    return from(this.appStateService.isAuthenticated$.isInitialized).pipe(
      mergeMap(() => from(this.authService.updateTokenIfNeeded())),
      mergeMap(() => {
        const headerValues = this.authService.getHeaderValues()
        let headers = request.headers
        for (const header in headerValues) {
          headers = headers.set(header, headerValues[header])
        }
        const authenticatedReq: HttpRequest<unknown> = request.clone({
          headers: headers,
        })
        return next.handle(authenticatedReq)
      })
    )
  }
}
