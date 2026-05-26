import { findElementWithStyleDataOrIntermediateStyleData } from './findElementWithStyleDataOrIntermediateStyleData'

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
