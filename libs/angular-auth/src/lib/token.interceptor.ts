import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, Inject, Optional } from '@angular/core'
import { AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { AngularAuthModuleConfig } from './angular-auth.module'
import { ANGULAR_AUTH_CONFIG } from './angular-injection-token'
import { AngularAuthServiceWrapper } from './angular-auth-service-wrapper'

const WHITELIST = ['assets']

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_SERVICE) private authService: AngularAuthServiceWrapper,
    @Inject(ANGULAR_AUTH_CONFIG) @Optional() private angularModuleConfig: AngularAuthModuleConfig
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return of()
  }
}
