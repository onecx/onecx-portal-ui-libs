import { APP_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { UserService } from './user.service'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

export function provideConnectionService() {
  return [
    ConnectionService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory() {
        return () => {}
      },
    },
  ]
}

@Injectable()
export class ConnectionService implements OnDestroy {
  languageSub: Subscription
  constructor(userService: UserService, translateService: TranslateService) {
    this.languageSub = userService.lang$.subscribe((lang) => translateService.use(lang))
  }
  ngOnDestroy(): void {
    this.languageSub.unsubscribe()
  }
}
