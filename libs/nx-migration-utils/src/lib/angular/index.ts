// Angular specific NX migration utilities

// Model
export * from './model/matching-module.model'
export * from './model/module.model'
export * from './model/provider.model'

// Utils
export * from './html-templates.utils'
export * from './parameters.utils'
export * from './replacement-in-files.utils'
export * from './utils/patterns.utils'
export * from './utils/detection/detect-modules-importing-module.utils'
export * from './utils/detection/detect-variables-with-module.utils'
export * from './utils/detection/detect-variables-with-provider.utils'
export * from './utils/detection/detect-modules-and-components.utils'
export * from './utils/modification/add-provider-import-if-does-not-exist.utils'
export * from './utils/modification/add-provider-import-in-file.utils'
export * from './utils/modification/add-provider-in-module-if-does-not-exist.utils'
export * from './utils/modification/add-provider-in-module.utils'
export * from './utils/modification/add-provider-to-module-or-component.utils'
export * from './utils/validation/is-provider-import-in-file.utils'
export * from './utils/validation/is-provider-in-module.utils'
export * from './utils/validation/is-import-in-imports-array.utils'
