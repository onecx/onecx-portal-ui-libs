import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { AuthProxyService } from './auth-proxy.service'
import { TokenInterceptor } from './token.interceptor'

export function provideTokenInterceptor() {
  return [
    AuthProxyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ]
}

@NgModule({
  imports: [CommonModule],
  providers: [
    provideTokenInterceptor()
  ],
})
export class AngularAuthModule {}
