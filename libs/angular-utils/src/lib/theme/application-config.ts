import { ApplicationConfig } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'

export function provideThemeConfig() {
  return [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset
      }
    })
  ]
}

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
