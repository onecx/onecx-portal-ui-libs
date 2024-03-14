import { map } from 'rxjs'
import { IL10nsStrings, TimeagoIntl } from 'ngx-timeago'
import { strings as englishStrings } from 'ngx-timeago/language-strings/en'
import { strings as germanStrings } from 'ngx-timeago/language-strings/de'
import { UserService } from '@onecx/angular-integration-interface'

export class OcxTimeagoIntl extends TimeagoIntl {
  private LANG_TO_STRINGS: { [key: string]: IL10nsStrings } = {
    en: englishStrings,
    de: germanStrings,
  }
  private DEFAULT_LANG = 'en'

  constructor(protected userService: UserService) {
    super()
    this.strings = englishStrings
    userService.lang$
      .pipe(
        map((lang) => {
          return this.getBestMatchLanguage(lang as string)
        })
      )
      .subscribe((lang) => {
        this.strings = this.LANG_TO_STRINGS[lang]
        this.changes.next()
      })
  }

  getBestMatchLanguage(lang: string) {
    if (Object.keys(this.LANG_TO_STRINGS).includes(lang)) {
      return lang
    } else {
      console.log(`${lang} is not supported. Using ${this.DEFAULT_LANG} as a fallback.`)
    }
    return this.DEFAULT_LANG
  }
}
