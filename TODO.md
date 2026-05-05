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
- [ ] Use new approach in libs and test it for table
- [ ] In case of a v1 theme the process of writing variables to the documentElement should remain unchanged, meaning that the variables should be written as they are currently being written. In case of a v2 theme, the process requires a new function that looks at what values are used from css variables in mapper function and creates all of these css variables before injecting them on the documentElement.

To test this I can just mock the theme returned from the BFF to match the structure of the new theme and check if the variables are properly applied. I can also test that the old theme structure still works by loading a normal theme in local env.

