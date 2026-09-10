import { AutoFocus } from 'primeng/autofocus'

// Call this on in remoteModule ngOnBootstrap or constructor to apply the PrimeNG AutoFocus patch.
// It normalizes PrimeNG's buggy `autofocus === false` comparison so an unset (undefined/null) `autofocus` input no longer stamps a stray `autofocus="true"` on inner native elements — covering deeply-nested
// Explicit `autofocus="true"` still works. 
export function patchPrimeNgAutoFocus(): void {
  // Fast, class-scoped idempotency guard.
  const autoFocusClass = AutoFocus as unknown as { __onecxAutofocusPatched?: boolean }
  if (autoFocusClass.__onecxAutofocusPatched) {
    return
  }
  autoFocusClass.__onecxAutofocusPatched = true

  try {
    const proto = AutoFocus.prototype as unknown as {
      onAfterContentChecked?: (this: AutoFocus) => void
    }

    const original = proto.onAfterContentChecked
    if (typeof original !== 'function') {
      // PrimeNG changed/removed the hook; leave behavior as-is rather than break.
      console.warn('[OneCX PatchPrimeNgAutoFocus] AutoFocus.onAfterContentChecked missing; patch skipped.')
      return
    }

    proto.onAfterContentChecked = function (this: AutoFocus) {
      // Normalize the buggy unset case (undefined | null) to false so the original method's `=== false` branch removes the `autofocus` attribute on the host (the inner native element) instead of stamping it.
      if (this.autofocus == null) {
        this.autofocus = false
      }
      return original.call(this)
    }
  } catch (err) {
    console.error('[OneCX PatchPrimeNgAutoFocus] patchPrimeNgAutoFocus failed; PrimeNG autofocus behavior unchanged.', err)
  }
}
