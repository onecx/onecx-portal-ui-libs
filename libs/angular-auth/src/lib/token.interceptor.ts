import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, Inject, Optional } from '@angular/core'
import { AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { AuthServiceWrapper } from './angular-auth-service-wrapper'

const WHITELIST = ['assets']

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthServiceWrapper) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skip = WHITELIST.some((str) => request.url.includes(str))
    if (skip) {
      return next.handle(request)
    }
    let headerValues = this.authService.getHeaderValues()
    let headers = request.headers
    for (const header in headerValues) {
      headers = headers.set(header, headerValues[header])
    }
    const authenticatedReq: HttpRequest<unknown> = request.clone({
      headers: headers,
    })
    return next.handle(authenticatedReq)
  }
}
