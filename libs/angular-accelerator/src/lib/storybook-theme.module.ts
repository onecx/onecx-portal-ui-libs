import { NgModule } from '@angular/core'
import { provideOptimus } from '@openng/optimus-ui/config'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { CustomPreset } from '@onecx/angular-utils/theme/optimus'

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    provideOptimus({
      theme: {
        preset: CustomPreset,
        options: { darkModeSelector: false },
      },
    }),
  ],
})
export class StorybookThemeModule {}
