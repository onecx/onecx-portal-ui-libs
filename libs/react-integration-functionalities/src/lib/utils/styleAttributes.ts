/**
 * @READ_THIS THIS FILE IS CREATED PURELY BECAUSE:
 * @description @angular-utils does some other things, when importing these variables, that break the application
 * Probably needs some additional deps
 */

export const shellScopeId = 'shell-ui';
/**
 * @constant {string} dataStyleIdKey
 * @description Marks start of scope section for scopeId (e.g. data-style-id="onecx-workspace|onecx-workspace-ui")
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIdKey = 'styleId';
/**
 * @constant {string} dataStyleIsolationKey
 * @description Marks end of scope section
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIsolationKey = 'styleIsolation';
/**
 * @constant {string} dataNoPortalLayoutStylesKey
 * @description Should always be in pair with styleId
 * Marks that scope section does not request portal layout styles
 * Present for MFE and RC components as well as dynamic content since libs v6
 */
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles';
/**
 * @constant {string} dataMfeElementKey
 * @description Marks element as the mfe content
 * Marks that scope section does not request portal layout styles
 * Present for MFE and its dynamic content
 */
export const dataMfeElementKey = 'mfeElement';
/**
 * @constant {string} dataIntermediateStyleIdKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 * (e.g. data-intermediate-style-id="onecx-workspace|onecx-workspace-ui")
 */
export const dataIntermediateStyleIdKey = 'intermediateStyleId';
/**
 * @constant {string} dataIntermediateMfeElementKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateMfeElementKey = 'intermediateMfeElement';
/**
 * @constant {string} dataIntermediateStyleIsolationKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation';
/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateNoPortalLayoutStylesKey =
  'intermediateNoPortalLayoutStyles';
/**
 * @constant {string} dataVariableOverrideIdKey
 * @description Marks the style element as one containing overrides for scope sections with scopeId
 */
export const dataVariableOverrideIdKey = 'VariableOverrideId';
/**
 * @constant {string} dataPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles
 */
export const dataPortalLayoutStylesKey = 'portalLayoutStylesStyles';
/**
 * @constant {string} dataDynamicPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles for the dynamic content
 */
export const dataDynamicPortalLayoutStylesKey =
  'dynamicContentPortalLayoutStyles';
/**
 * @constant {string} dataStyleIdAttribute
 * @description HTML attribute for styleId. See {@link dataStyleIdKey} for more details.
 */
export const dataStyleIdAttribute = 'data-style-id';
/**
 * @constant {string} dataMfeElementAttribute
 * @description HTML attribute for mfe element. See {@link dataMfeElementKey} for more details.
 */
export const dataMfeElementAttribute = 'data-mfe-element';
/**
 * @constant {string} dataStyleIsolationAttribute
 * @description HTML attribute for styleIsolation. See {@link dataStyleIsolationKey} for more details.
 */
export const dataStyleIsolationAttribute = 'data-style-isolation';
/**
 * @constant {string} dataNoPortalLayoutStylesAttribute
 * @description HTML attribute for noPortalLayoutStyles. See {@link dataNoPortalLayoutStylesKey} for more details.
 */
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles';
/**
 * @constant {string} dataIntermediateStyleIdAttribute
 * @description HTML attribute for intermediateStyleId. See {@link dataIntermediateStyleIdKey} for more details.
 */
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id';
/**
 * @constant {string} dataIntermediateMfeElementAttribute
 * @description HTML attribute for intermediateMfeElement. See {@link dataIntermediateMfeElementKey} for more details.
 */
export const dataIntermediateMfeElementAttribute =
  'data-intermediate-mfe-element';
/**
 * @constant {string} dataIntermediateStyleIsolationAttribute
 * @description HTML attribute for intermediateStyleIsolation. See {@link dataIntermediateStyleIsolationKey} for more details.
 */
export const dataIntermediateStyleIsolationAttribute =
  'data-intermediate-style-isolation';
/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesAttribute
 * @description HTML attribute for intermediateNoPortalLayoutStyles. See {@link dataIntermediateNoPortalLayoutStylesKey} for more details.
 */
export const dataIntermediateNoPortalLayoutStylesAttribute =
  'data-intermediate-no-portal-layout-styles';
/**
 * @constant {string} dataVariableOverrideIdAttribute
 * @description HTML attribute for variableOverrideId. See {@link dataVariableOverrideIdKey} for more details.
 */
export const dataVariableOverrideIdAttribute = 'data-variable-override-id';
/**
 * @constant {string} dataPortalLayoutStylesAttribute
 * @description HTML attribute for portalLayoutStyles. See {@link dataPortalLayoutStylesKey} for more details.
 */
export const dataPortalLayoutStylesAttribute = 'data-portal-layout-styles';
