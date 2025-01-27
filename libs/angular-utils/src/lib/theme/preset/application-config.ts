import { ApplicationConfig } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './custom-preset'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
      },
    }),
  ],
}
