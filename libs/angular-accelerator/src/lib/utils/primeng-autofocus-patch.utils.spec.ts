import { AutoFocus } from 'primeng/autofocus'
import { patchPrimeNgAutoFocus } from './primeng-autofocus-patch.utils'

type AutoFocusHook = (this: AutoFocus) => void
type PatchableAutoFocusPrototype = { onAfterContentChecked?: AutoFocusHook }
type PatchableAutoFocusClass = typeof AutoFocus & { __onecxAutofocusPatched?: boolean }

// Real native elements so tests reflect actual pAutoFocus usage (e.g. p-button, p-inputtext, a plain span).
const createAutoFocusInstance = (
  autofocus: boolean | null | undefined,
  options: { tagName?: 'button' | 'input' | 'span'; focused?: boolean } = {}
) => {
  const { tagName = 'span', focused = true } = options
  return {
    autofocus,
    focused,
    autoFocus: jest.fn(),
    host: { nativeElement: document.createElement(tagName) },
  } as unknown as AutoFocus
}

const getHostElement = (instance: AutoFocus) => instance.host.nativeElement as HTMLElement

describe('patchPrimeNgAutoFocus', () => {
  const proto = AutoFocus.prototype as unknown as PatchableAutoFocusPrototype
  const patchableClass = AutoFocus as PatchableAutoFocusClass
  let originalOnAfterContentChecked: AutoFocusHook

  beforeEach(() => {
    originalOnAfterContentChecked = proto.onAfterContentChecked as AutoFocusHook
  })

  afterEach(() => {
    // Restore PrimeNG's untouched prototype method so tests don't leak patch state into each other.
    Object.defineProperty(proto, 'onAfterContentChecked', {
      value: originalOnAfterContentChecked,
      writable: true,
      configurable: true,
    })
    delete patchableClass.__onecxAutofocusPatched
  })

  describe('unpatched PrimeNG behavior (documents the bug this patch works around)', () => {
    // If this test starts failing, PrimeNG has fixed the underlying bug and this patch can likely be removed.
    it.each([
      ['undefined', undefined],
      ['null', null],
    ])('should wrongly stamp the autofocus as true attribute when autofocus is %s', (_label, value) => {
      const instance = createAutoFocusInstance(value)

      originalOnAfterContentChecked.call(instance)

      expect(getHostElement(instance).getAttribute('autofocus')).toBe('true')
    })
  })

  describe('patched PrimeNG behavior', () => {
    beforeEach(() => {
      patchPrimeNgAutoFocus()
    })

    it.each([
      { label: 'true on a <button>', input: true, tagName: 'button' as const, expectedAttribute: true },
      { label: 'false on an <input>', input: false, tagName: 'input' as const, expectedAttribute: false },
      { label: 'null on a <span>', input: null, tagName: 'span' as const, expectedAttribute: false },
      { label: 'undefined on a <button>', input: undefined, tagName: 'button' as const, expectedAttribute: false },
    ])(
      'should set the autofocus attribute only when explicitly true ($label)',
      ({ input, tagName, expectedAttribute }) => {
        const instance = createAutoFocusInstance(input, { tagName })

        proto.onAfterContentChecked?.call(instance)

        expect(instance.autofocus).toBe(input) // the patch no longer mutates the input value
        expect(getHostElement(instance).hasAttribute('autofocus')).toBe(expectedAttribute)
      }
    )

    it('should call autoFocus() when not yet focused', () => {
      const instance = createAutoFocusInstance(true, { focused: false })

      proto.onAfterContentChecked?.call(instance)

      expect(instance.autoFocus).toHaveBeenCalledTimes(1)
    })

    it('should not wrap onAfterContentChecked again when called more than once', () => {
      const patchedOnce = proto.onAfterContentChecked

      patchPrimeNgAutoFocus()

      expect(proto.onAfterContentChecked).toBe(patchedOnce)
    })
  })

  it('should skip patching when onAfterContentChecked is missing', () => {
    // Assigning undefined (rather than deleting the own property) avoids falling through to BaseComponent's inherited hook.
    proto.onAfterContentChecked = undefined

    patchPrimeNgAutoFocus()

    expect(proto.onAfterContentChecked).toBeUndefined()
  })

  it('should not throw when patching fails', () => {
    Object.defineProperty(proto, 'onAfterContentChecked', {
      value: originalOnAfterContentChecked,
      writable: false,
      configurable: true,
    })

    expect(() => patchPrimeNgAutoFocus()).not.toThrow()
  })
})
