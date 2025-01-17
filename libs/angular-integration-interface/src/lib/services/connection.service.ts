import { Injectable, OnDestroy } from '@angular/core'
import { UserService } from './user.service'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

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
