import { getOnecxTriggerElement } from './onecx-trigger-element'

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
