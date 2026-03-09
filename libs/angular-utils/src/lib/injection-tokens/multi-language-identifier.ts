import { InjectionToken } from '@angular/core'

export type MultiLanguageIdentifier = {
  name: string
  version?: string,
  type: 'app' | 'lib'
}

export const MULTI_LANGUAGE_IDENTIFIER = new InjectionToken<MultiLanguageIdentifier[]>(
  'MULTI_LANGUAGE_IDENTIFIER'
)

