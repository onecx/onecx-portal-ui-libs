import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { merge, mergeMap, Subscription } from 'rxjs'
import { Optimus } from '@openng/optimus-ui/config';

@Injectable()
export class TranslationConnectionService implements OnDestroy {
  languageSub: Subscription
  translationSub: Subscription

  constructor() {
    const userService = inject(UserService)
    const translateService = inject(TranslateService)
    const configuration = inject(Optimus)

    this.languageSub = userService.lang$.subscribe((lang) => translateService.use(lang))

    this.translationSub = merge(
      translateService.onLangChange,
      translateService.onTranslationChange,
      translateService.onFallbackLangChange)
      .pipe(mergeMap(() => translateService.get('optimus')))
      .subscribe((res) => configuration.setTranslation(res))
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe()
    this.translationSub.unsubscribe()
  }
}
