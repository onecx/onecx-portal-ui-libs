import { InjectionToken } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { OnecxTranslateLoader } from './onecx-translate-loader.utils'

export const TRANSLATION_PATH = new InjectionToken<(string | Observable<string> | Promise<string>)[]>(
  'TRANSLATION_PATH'
)

export function createTranslateLoader(): TranslateLoader {
  return new OnecxTranslateLoader()
}
