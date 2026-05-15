import {
  shellScopeId,
  dataStyleIdKey,
  dataStyleIsolationKey,
  dataNoPortalLayoutStylesKey,
  dataMfeElementKey,
  dataIntermediateStyleIdKey,
  dataIntermediateMfeElementKey,
  dataIntermediateStyleIsolationKey,
  dataIntermediateNoPortalLayoutStylesKey,
  dataVariableOverrideIdKey,
  dataPortalLayoutStylesKey,
  dataDynamicPortalLayoutStylesKey,
  dataStyleIdAttribute,
  dataMfeElementAttribute,
  dataStyleIsolationAttribute,
  dataNoPortalLayoutStylesAttribute,
  dataIntermediateStyleIdAttribute,
  dataIntermediateMfeElementAttribute,
  dataIntermediateStyleIsolationAttribute,
  dataIntermediateNoPortalLayoutStylesAttribute,
  dataVariableOverrideIdAttribute,
  dataPortalLayoutStylesAttribute,
} from './styleAttributes'

describe('styleAttributes', () => {
  it('should export shellScopeId', () => {
    expect(shellScopeId).toBe('shell-ui')
  })

  it('should export data attribute keys', () => {
    expect(dataStyleIdKey).toBe('styleId')
    expect(dataStyleIsolationKey).toBe('styleIsolation')
    expect(dataNoPortalLayoutStylesKey).toBe('noPortalLayoutStyles')
    expect(dataMfeElementKey).toBe('mfeElement')
    expect(dataIntermediateStyleIdKey).toBe('intermediateStyleId')
    expect(dataIntermediateMfeElementKey).toBe('intermediateMfeElement')
    expect(dataIntermediateStyleIsolationKey).toBe('intermediateStyleIsolation')
    expect(dataIntermediateNoPortalLayoutStylesKey).toBe('intermediateNoPortalLayoutStyles')
    expect(dataVariableOverrideIdKey).toBe('VariableOverrideId')
    expect(dataPortalLayoutStylesKey).toBe('portalLayoutStylesStyles')
    expect(dataDynamicPortalLayoutStylesKey).toBe('dynamicContentPortalLayoutStyles')
  })

  it('should export HTML attribute names', () => {
    expect(dataStyleIdAttribute).toBe('data-style-id')
    expect(dataMfeElementAttribute).toBe('data-mfe-element')
    expect(dataStyleIsolationAttribute).toBe('data-style-isolation')
    expect(dataNoPortalLayoutStylesAttribute).toBe('data-no-portal-layout-styles')
    expect(dataIntermediateStyleIdAttribute).toBe('data-intermediate-style-id')
    expect(dataIntermediateMfeElementAttribute).toBe('data-intermediate-mfe-element')
    expect(dataIntermediateStyleIsolationAttribute).toBe('data-intermediate-style-isolation')
    expect(dataIntermediateNoPortalLayoutStylesAttribute).toBe('data-intermediate-no-portal-layout-styles')
    expect(dataVariableOverrideIdAttribute).toBe('data-variable-override-id')
    expect(dataPortalLayoutStylesAttribute).toBe('data-portal-layout-styles')
  })
})
