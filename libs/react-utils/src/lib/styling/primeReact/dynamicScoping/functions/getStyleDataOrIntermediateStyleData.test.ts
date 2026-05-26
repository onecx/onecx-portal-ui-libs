import { getStyleDataOrIntermediateStyleData } from './getStyleDataOrIntermediateStyleData'

describe('getStyleDataOrIntermediateStyleData', () => {
  it('returns null when no style data element found', () => {
    const el = document.createElement('div')
    expect(getStyleDataOrIntermediateStyleData(el)).toBeNull()
  })

  it('returns null when element has data-style-id="shell-ui"', () => {
    const el = document.createElement('div')
    el.dataset['styleId'] = 'shell-ui'
    expect(getStyleDataOrIntermediateStyleData(el)).toBeNull()
  })

  it('returns StyleData from element with data-style-id', () => {
    const el = document.createElement('div')
    el.dataset['styleId'] = 'app-scope'
    const result = getStyleDataOrIntermediateStyleData(el)
    expect(result).not.toBeNull()
    expect(result!.dataIntermediateStyleIdKey).toBe('app-scope')
  })

  it('returns StyleData with intermediate id when only intermediate is set', () => {
    const el = document.createElement('div')
    el.dataset['intermediateStyleId'] = 'intermediate-scope'
    const result = getStyleDataOrIntermediateStyleData(el)
    expect(result).not.toBeNull()
    expect(result!.dataIntermediateStyleIdKey).toBe('intermediate-scope')
  })

  it('includes noPortalLayoutStyles from element dataset', () => {
    const el = document.createElement('div')
    el.dataset['styleId'] = 'app-scope'
    el.dataset['noPortalLayoutStyles'] = 'true'
    const result = getStyleDataOrIntermediateStyleData(el)
    expect(result!.dataIntermediateNoPortalLayoutStylesKey).toBe('true')
  })
})
