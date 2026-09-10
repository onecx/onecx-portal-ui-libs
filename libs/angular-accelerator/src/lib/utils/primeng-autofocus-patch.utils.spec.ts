import { AutoFocus } from 'primeng/autofocus'
import { patchPrimeNgAutoFocus } from './primeng-autofocus-patch.utils'

type AutoFocusHook = (this: AutoFocus) => void
type PatchableAutoFocusPrototype = { onAfterContentChecked?: AutoFocusHook }
type PatchableAutoFocusClass = typeof AutoFocus & { __onecxAutofocusPatched?: boolean }

// Real native elements so tests reflect actual pAutoFocus usage (e.g. p-button, p-inputtext, a plain span).
const createAutoFocusInstance = (
  autofocus: boolean | null | undefined,
  tagName: 'button' | 'input' | 'span' = 'span'
) =>
  ({
    autofocus,
    focused: true, // skips the inherited autoFocus() side effect so the test stays focused on the patch
    host: { nativeElement: document.createElement(tagName) },
  }) as unknown as AutoFocus

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
      { label: 'true on a <button>', input: true, tagName: 'button' as const, expectedAutofocus: true },
      { label: 'false on an <input>', input: false, tagName: 'input' as const, expectedAutofocus: false },
      { label: 'null on a <span>', input: null, tagName: 'span' as const, expectedAutofocus: false },
      { label: 'undefined on a <button>', input: undefined, tagName: 'button' as const, expectedAutofocus: false },
    ])(
      'should apply autofocus only when explicitly true or false ($label)',
      ({ input, tagName, expectedAutofocus }) => {
        const instance = createAutoFocusInstance(input, tagName)

        proto.onAfterContentChecked?.call(instance)

        expect(instance.autofocus).toBe(expectedAutofocus)
        expect(getHostElement(instance).hasAttribute('autofocus')).toBe(expectedAutofocus)
      }
    )

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
