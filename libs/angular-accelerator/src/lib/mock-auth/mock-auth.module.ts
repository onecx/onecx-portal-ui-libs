import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { AUTH_SERVICE } from '../api/injection-tokens'
import { MockAuthService } from './mock-auth.service'

function initializer(authService: MockAuthService): () => Promise<any> {
  console.log(`Start Mock auth initializer`)

  return (): Promise<any> =>
    authService.init().then((res) => {
      console.log(`mock auth app_initializer resolved ${res}`)
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
