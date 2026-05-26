import { appendIntermediateStyleData } from './appendIntermediateStyleData'
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
