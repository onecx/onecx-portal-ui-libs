import { Injectable } from '@angular/core'
import { UserProfileTopic } from '@onecx/integration-interface'
import { BehaviorSubject } from 'rxjs'
import { DEFAULT_LANG } from '../api/constants'

@Injectable({ providedIn: 'root' })
export class UserService {
  profile$ = new UserProfileTopic()
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  constructor() {
    this.profile$.subscribe((profile) =>
      this.lang$.next(
        profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
      )
    )
  }

  private determineLanguage(): string | undefined {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined
    }

    let browserLang: any = window.navigator.languages ? window.navigator.languages[0] : null
    browserLang = browserLang || window.navigator.language

    if (typeof browserLang === 'undefined') {
      return undefined
    }

    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0]
    }

    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0]
    }

    return browserLang
  }
}
