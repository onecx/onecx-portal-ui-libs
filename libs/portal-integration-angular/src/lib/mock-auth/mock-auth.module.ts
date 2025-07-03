import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { MockAuthService } from './mock-auth.service'

function initializer(authService: MockAuthService): () => Promise<any> {

  return (): Promise<any> =>
    authService.init().then((res) => {
      return res
    })
}

/**
 * Mock auth module providing mocked user profile and authnetication. For dev use only.
 */
@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: MockAuthService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [AUTH_SERVICE],
    },
  ],
})
export class MockAuthModule {}
