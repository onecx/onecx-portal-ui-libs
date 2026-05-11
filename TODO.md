# Required changes for theming poc

- [x] Create a new theme model in `libs/integration-interface/src/lib/topics/current-theme/v2/theme.model.ts`
  - This model should contain a v1Theme property of type `Theme` and should otherwise conform to the created ZOD schema for the new schema. Additionally, it should have a receivedVersions property that is an array of numbers representing the versions of the theme that have been received from the BFF. This is needed to determine whether we have received a v1 theme, a v2 theme or both.

- [ ] Create a shared schema.json file and build a ZOD schema for it in client side code. This file can be shared between BFF, SVC and UI.

- [x] Create a new theme topic in `libs/integration-interface/src/lib/topics/current-theme/v2/current-theme-topic.ts` and add the following code to it:

```
import { Topic } from '@onecx/accelerator'

interface Themes {
  themes: // type this as theme schema from zod definition
}

export class CurrentThemesTopic extends Topic<Themes> {
  constructor() {
    super('currentThemes', 1)
  }
}
```

- [ ] Update the publishing to do the following:
  - In theme-config.service.ts:
    - In applyThemeVariables, the first line should check if themes property from passed object contains a non-null, non-undefined value for the v2 property.
    - If it does, it should use the new mapping logic from theme-v2-evaluation to do the mapping and then set theme.preset in setThemeConfig to mergeDeep(MAPPING_RESULT, overridesFolded)
    - If it does not, it should keep the existing mapping logic
  - In app.module.ts (in apply function) of shell:
    - Check if object received in apply function matches the expected structure for currentThemes
    - If yes, publish as is on currentThemes topic and additionally publish the v1Theme property of the received object on the old theme topic to ensure backwards compatibility.
    - If no, transform and publish according to the rules below:
      - If it returns a v1 theme, it should be published as is using the existing topic and should additionally publish an object on the new topic that contains nothing but the v1 theme in the v1Theme property.
      - If it returns a v2 theme, it should be published on the new topic. The old topic should be published with the content of the v1Theme property of the v2 theme (whatever that may be).
  - [ ] Update applyTheme functionality to always use the new theme topic to apply the theme. The old topic is only there for backwards compatibility and all contents of the old topic will be written to the new topic as described in the previous point, so there should be no need to read from the old topic at all.
    - [ ] To support this, we need to add a new THEME_V2 capability in shell that is used to determine whether the shell supports the new theme topic or not. If the shell does not support the new topic, we should fall back to reading from the old topic.
- [ ] Add THEME_CONFIG_SERVICE_OPTIONS injection token to theme-config.service.ts and use it to determine if advanced theming should be used and what the max supported theme version is. See chat with Jan.
- [ ] Use new approach in libs and test it for table
- [ ] In case of a v1 theme the process of writing variables to the documentElement should remain unchanged, meaning that the variables should be written as they are currently being written. In case of a v2 theme, the process requires a new function that looks at what values are used from css variables in mapper function and creates all of these css variables before injecting them on the documentElement.

# New

- [ ] We currently have a nesting of default.default.default. This should be renamed to defaultVariant, defaultState etc. for better readability and maintainability.
      To test this I can just mock the theme returned from the BFF to match the structure of the new theme and check if the variables are properly applied. I can also test that the old theme structure still works by loading a normal theme in local env.
  - Adjust mapping rules accordingly
  - Check if mapping rules from property can only accept existing property paths instead of all dot separated strings (compile time validation or, if not possible, runtime validation with error throwing)
    - Check if schemas exist for PrimeNG theme so that we can also perform validation on the to property of the mapping rules
      - Information should be pulled from primeng package in node_modules to ensure that it is always up to date with the version of PrimeNG that we are using 
- [ ] Split css rules into multiple files
- [ ] Create `injectCSSVariables` function in a service in shell and use it in shells `app.module.ts` instead of the currently used `apply` function.
  - This function should inject the variables for both themes into the head (see how this is currently done for the `apply`)
  - Test this service
- [ ] Implement apply logic for theme v2, reuse apply logic for theme v1
  - maxVersion can be injected using THEME_CONFIG_SERVICE_OPTIONS token (see below)

  ```
    const usedVersion = this.options.maxVersion ?? configService.getConfig(DEFAULT_THEME_VERSION) ?? 1
  ```

  - Check if usedVersion exists in the versions property of the CurrentThemesTopic. If it does, use the theme for that version to apply the theme. If it does not, take usedVersion - 1 from the array iteratively until you find a version. If you reach 0 without finding a version, throw an error because this means that we do not have any theme available that matches the required version.
  - This logic ensures that we always apply the best possible theme version while also ensuring backwards compatibility

- [ ] Add overload to `provideThemeConfigService` method (see below)
  - Function is called in `provideThemeConfig` in angular-utils `application-config` (see below)
  ```
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
  import { providePrimeNG } from 'primeng/config'
  import { provideThemeConfigService } from '../services/theme-config.service'
  import { InjectionToken } from '@angular/core'
  import { provideAppStylesInitializer } from './app-styles-initializer'
  export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
  export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

  export interface ThemeConfigProviderOptions {
    overrides?: ThemeOverrides
    isAdvancedTheming?: boolean
    maxVersion: number
  }

  export function provideThemeConfig(options?: ThemeConfigProviderOptions) {
    const dynamicProviders = []
    if (options?.overrides) {
    dynamicProviders.push({
    provide: THEME_OVERRIDES,
    useValue: options.overrides,
    })
    }
    return [
    provideAnimationsAsync(),
    providePrimeNG({}),
    options? provideThemeConfigService({ isAdvanced: options?.isAdvancedTheming ?? false, maxVersion: options?.maxVersion ?? 1 }): provideThemeConfigService(),
    provideAppStylesInitializer(),
    ...dynamicProviders,
    ]

  }

```

```
  export const THEME_CONFIG_SERVICE_OPTIONS = new InjectionToken<{ isAdvanced?: boolean; maxVersion?: number }>('THEME_CONFIG_SERVICE_OPTIONS');

  type Options = { isAdvanced?: boolean; maxVersion: number }
  /**
    @deprecated
    */
    export function provideThemeConfigService(isAdvanced?: boolean): any
    export function provideThemeConfigService(options: Options): any

  export function provideThemeConfigService(isAdvancedOrOptions?: boolean|Options): any {
  Theme.clearLoadedStyleNames()
  Base.clearLoadedStyleNames()
  const isAdvanced = typeof isAdvancedOrOptions === 'boolean' ? isAdvancedOrOptions : isAdvancedOrOptions?.isAdvanced
  return [
  {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useFactory() {
  return () => inject(ThemeConfigService)
  },
  },
  ThemeConfigService,
  {
  provide: UseStyle,
  useClass: CustomUseStyle,
  },
  { provide: IS_ADVANCED_THEMING, useValue: isAdvanced ?? false },
  { provide: THEME_CONFIG_SERVICE_OPTIONS, useValue: typeof isAdvancedOrOptions === 'boolean' ? { isAdvanced: isAdvancedOrOptions } : isAdvancedOrOptions ?? {} },
  ]
  }
```

- [ ] Move mapping logic from theme-v2-evaluation repo to onecx-portal-ui-libs
- [ ] Ensure that primeNGOverrides are being applied after mapping (see existing `applyThemeVariablesV1` in theme-config.service.ts for reference on how to apply the overrides)
- [ ] Move and update docs to match updated theming approach and structure
- [ ] Add a customCSSVariables property of type Record<string, string> to the ThemeProperties model and inject all key value pairs as css variables into the head without adding any suffix or prefix
