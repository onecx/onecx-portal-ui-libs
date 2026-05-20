import { appendIntermediateStyleData } from './appendIntermediateStyleData'
import { findElementWithStyleDataOrIntermediateStyleData } from './findElementWithStyleDataOrIntermediateStyleData'
import { getStyleDataOrIntermediateStyleData } from './getStyleDataOrIntermediateStyleData'
import { getOnecxTriggerElement } from './onecx-trigger-element'
import type { StyleData } from '../types'

describe('appendIntermediateStyleData', () => {
  it('returns empty object when all StyleData fields are undefined', () => {
    const styleData: StyleData = {
      dataIntermediateStyleIdKey: undefined,
      dataIntermediateNoPortalLayoutStylesKey: undefined,
      dataIntermediateMfeElementKey: undefined,
    }
    expect(appendIntermediateStyleData(styleData)).toEqual({})
  })

  it('includes data-intermediate-style-id when defined', () => {
    const styleData: StyleData = {
      dataIntermediateStyleIdKey: 'my-scope',
      dataIntermediateNoPortalLayoutStylesKey: undefined,
      dataIntermediateMfeElementKey: undefined,
    }
    const result = appendIntermediateStyleData(styleData)
    expect(result['data-intermediate-style-id']).toBe('my-scope')
  })

  it('includes data-intermediate-no-portal-layout-styles for empty string value', () => {
    const styleData: StyleData = {
      dataIntermediateStyleIdKey: undefined,
      dataIntermediateNoPortalLayoutStylesKey: '',
      dataIntermediateMfeElementKey: undefined,
    }
    const result = appendIntermediateStyleData(styleData)
    expect(result['data-intermediate-no-portal-layout-styles']).toBe('')
  })

  it('includes data-intermediate-mfe-element for empty string value', () => {
    const styleData: StyleData = {
      dataIntermediateStyleIdKey: undefined,
      dataIntermediateNoPortalLayoutStylesKey: undefined,
      dataIntermediateMfeElementKey: '',
    }
    const result = appendIntermediateStyleData(styleData)
    expect(result['data-intermediate-mfe-element']).toBe('')
  })

  it('includes all fields when all are set', () => {
    const styleData: StyleData = {
      dataIntermediateStyleIdKey: 'scope-a',
      dataIntermediateNoPortalLayoutStylesKey: 'true',
      dataIntermediateMfeElementKey: 'mfe-1',
    }
    const result = appendIntermediateStyleData(styleData)
    expect(result['data-intermediate-style-id']).toBe('scope-a')
    expect(result['data-intermediate-no-portal-layout-styles']).toBe('true')
    expect(result['data-intermediate-mfe-element']).toBe('mfe-1')
  })
})

describe('findElementWithStyleDataOrIntermediateStyleData', () => {
  it('returns element that has data-style-id', () => {
    const el = document.createElement('div')
    el.dataset['styleId'] = 'my-scope'
    expect(findElementWithStyleDataOrIntermediateStyleData(el)).toBe(el)
  })

  it('returns element that has data-intermediate-style-id', () => {
    const el = document.createElement('div')
    el.dataset['intermediateStyleId'] = 'intermediate-scope'
    expect(findElementWithStyleDataOrIntermediateStyleData(el)).toBe(el)
  })

  it('walks up to parent with data-style-id', () => {
    const parent = document.createElement('div')
    parent.dataset['styleId'] = 'parent-scope'
    const child = document.createElement('span')
    parent.appendChild(child)

    expect(findElementWithStyleDataOrIntermediateStyleData(child)).toBe(parent)
  })

  it('returns null when no element has style data', () => {
    const el = document.createElement('div')
    expect(findElementWithStyleDataOrIntermediateStyleData(el)).toBeNull()
  })

  it('returns null for non-HTMLElement node', () => {
    const text = document.createTextNode('hello')
    expect(findElementWithStyleDataOrIntermediateStyleData(text)).toBeNull()
  })
})

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

describe('getOnecxTriggerElement', () => {
  afterEach(() => {
    delete (globalThis as any).onecxTriggerElement
  })

  it('returns undefined when onecxTriggerElement is not set', () => {
    expect(getOnecxTriggerElement()).toBeUndefined()
  })

  it('returns the element when onecxTriggerElement is set globally', () => {
    const el = document.createElement('div')
    ;(globalThis as any).onecxTriggerElement = el
    expect(getOnecxTriggerElement()).toBe(el)
  })

  it('returns null when onecxTriggerElement is explicitly null', () => {
    ;(globalThis as any).onecxTriggerElement = null
    expect(getOnecxTriggerElement()).toBeNull()
  })
})
