import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'
import { provideThemeConfigService } from '../services/theme-config.service'

export function provideThemeConfig() {
  return [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
      },
    }),
    provideThemeConfigService(),
  ]
}
