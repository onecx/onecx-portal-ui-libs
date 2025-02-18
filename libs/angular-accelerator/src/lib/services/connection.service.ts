import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { Subscription } from 'rxjs'

@Injectable()
export class ConnectionService implements OnDestroy {
  languageSub: Subscription

  constructor() {
    const userService = inject(UserService)
    const translateService = inject(TranslateService)

    this.languageSub = userService.lang$.subscribe((lang) => translateService.use(lang))
  }
  ngOnDestroy(): void {
    this.languageSub.unsubscribe()
  }
}
