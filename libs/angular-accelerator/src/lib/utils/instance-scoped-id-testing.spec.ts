import {
  expectInstanceScopedIds,
  instanceScopedId,
  instanceScopedIdSelector,
} from '../../../testing/instance-scoped-id'

function root(html: string): HTMLElement {
  const element = document.createElement('div')
  element.innerHTML = html
  document.body.appendChild(element)
  return element
}

describe('instance-scoped id test helpers', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should pass for instances with own ids and own references', () => {
    const first = root('<label for="input">A</label><input id="input" />')
    const second = root('<label for="input-1">A</label><input id="input-1" />')

    expect(() => expectInstanceScopedIds([first, second])).not.toThrow()
  })

  it('should throw when two instances use the same id', () => {
    const first = root('<button id="searchButton"></button>')
    const second = root('<button id="searchButton"></button>')

    expect(() => expectInstanceScopedIds([first, second])).toThrow(
      'id "searchButton" is used by instance 0 and instance 1'
    )
  })

  it('should throw when a reference points into another instance', () => {
    const first = root('<span id="label">Label</span>')
    const second = root('<button aria-labelledby="label other"></button>')

    expect(() => expectInstanceScopedIds([first, second])).toThrow(
      'aria-labelledby="label" of instance 1 points into another instance'
    )
  })

  it('should match the legacy id and suffixed ids only', () => {
    const pattern = instanceScopedId('page-header')

    expect(pattern.test('page-header')).toBe(true)
    expect(pattern.test('page-header-2')).toBe(true)
    expect(pattern.test('page-header-subtitle')).toBe(false)
    expect(instanceScopedIdSelector('page-header')).toBe('[id="page-header"], [id^="page-header-"]')
  })
})
