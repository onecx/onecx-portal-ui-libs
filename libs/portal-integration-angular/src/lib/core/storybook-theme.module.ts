import { NgModule } from '@angular/core'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
})
export class StorybookThemeModule {}
