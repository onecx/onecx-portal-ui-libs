import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core'
import { TranslationConnectionService } from '../services/translation-connection.service'

export function provideTranslationConnectionService() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(TranslationConnectionService)
      },
    },
    TranslationConnectionService,
  ]
}
