import { InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'

export const TRANSLATION_PATH = new InjectionToken<(string | Observable<string> | Promise<string>)[]>(
  'TRANSLATION_PATH'
)
