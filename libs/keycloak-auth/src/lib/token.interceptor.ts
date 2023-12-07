import { Inject, Injectable, Optional } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AUTH_SERVICE, IAuthService } from '@onecx/portal-integration-angular'
import { KEYCLOAK_AUTH_CONFIG, KeycloakAuthModuleConfig } from './keycloak-auth.module'

const WHITELIST = ['assets']

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(KEYCLOAK_AUTH_CONFIG) @Optional() private kcModuleConfig: KeycloakAuthModuleConfig
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skip = (this.kcModuleConfig?.tokenInterceptorWhitelist || WHITELIST).some((str) => request.url.includes(str))
    if (skip) {
      return next.handle(request)
    }

    const idToken = this.authService.getIdToken()
    if (idToken) {
      const authenticatedReq: HttpRequest<unknown> = request.clone({
        headers: request.headers.set('apm-principal-token', idToken),
      })
      return next.handle(authenticatedReq)
    } else {
      return next.handle(request)
    }
  }
}
