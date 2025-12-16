/**
 * @constant {string} dataRcStylesKey
 * @description Marks style element as one used by the current RC.
 */
export const dataRcStylesStart = 'slot'

/**
 * @constant {string} dataAppStylesKey
 * @description Marks style element as one containing styles for scopeId (which is based on the application)
 * Such style sheet contains variables applied globally and CSS scoped to a given scope until style isolation.
 * (e.g. data-app-styles="onecx-workspace|onecx-workspace-ui")
 */
export const dataAppStylesKey = 'appStyles'

/**
 * @constant {string} dataMfeStylesKey
 * @description Marks style element as one used by the current MFE.
 */
export const dataMfeStylesKey = 'mfeStyles'

/**
 * @function dataRcStylesKey
 * @description Marks style element as one used by any component in a slot given by the SLOT_NAME.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The key for the slot styles.
 */
export const dataRcStylesKey = (slotName: string) =>
  `${dataRcStylesStart}${slotName.replace(slotName.charAt(0), slotName.charAt(0).toUpperCase())}Styles`

/**
 * @constant {string} dataShellStylesKey
 * @description Marks style element as one containing styles for the shell.
 * Such style sheet contains variables applied globally and CSS scoped to a shell scope until style isolation.
 */
export const dataShellStylesKey = 'shellStyles'

/**
 * @constant {string} dataAppStylesAttribute
 * @description HTML attribute for appStyles. See {@link dataAppStylesKey} for more details.
 */
export const dataAppStylesAttribute = 'data-app-styles'

/**
 * @constant {string} dataMfeStylesAttribute
 * @description HTML attribute for mfeStyles. See {@link dataMfeStylesKey} for more details.
 */
export const dataMfeStylesAttribute = 'data-mfe-styles'

/**
 * @function dataRcStylesAttribute
 * @description HTML attribute for slot styles. See {@link dataRcStylesKey} for more details.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The attribute for the slot styles.
 */
export const dataRcStylesAttribute = (slotName: string) => `data-${dataRcStylesStart}-${slotName}-styles`

/**
 * @constant {string} dataShellStylesAttribute
 * @description HTML attribute for shellStyles. See {@link dataShellStylesKey} for more details.
 */
export const dataShellStylesAttribute = 'data-shell-styles'