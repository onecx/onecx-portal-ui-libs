import { NgModule } from '@angular/core'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { normalizeKeys, presetVariables } from '@onecx/angular-utils'
import { definePreset } from '@primeng/themes'

const preset = definePreset(normalizeKeys(Aura), normalizeKeys(presetVariables))
preset.semantic.colorScheme.dark = {}

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: preset,
        options: { darkModeSelector: false },
      },
    }),
  ],
})
export class StorybookThemeModule {}
