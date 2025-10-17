import { NgModule } from '@angular/core'
import { providePrimeNG } from 'primeng/config'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { CustomPreset } from '@onecx/angular-utils/theme/primeng'

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: { darkModeSelector: false },
      },
    }),
  ],
})
export class StorybookThemeModule {}
