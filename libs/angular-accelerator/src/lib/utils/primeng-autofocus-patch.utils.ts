import { AutoFocus } from 'primeng/autofocus'
import { createLogger } from './logger.utils'

const logger = createLogger('PrimeNgAutoFocusPatch')

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
      logger.warn('[OneCX PatchPrimeNgAutoFocus] AutoFocus.onAfterContentChecked missing; patch skipped.')
      return
    }

    proto.onAfterContentChecked = function (this: AutoFocus) {
      // Apply the autofocus attribute only when explicitly true, removing it otherwise.
      // Apply the autofocus attribute only when explicitly true, removing it otherwise.
      if (this.autofocus === true) {
        this.host.nativeElement.setAttribute('autofocus', true)
      } else {
        this.host.nativeElement.removeAttribute('autofocus')
      }

      if (!this.focused) {
        this.autoFocus()
      }
    }
  } catch (err) {
    logger.error(
      '[OneCX PatchPrimeNgAutoFocus] patchPrimeNgAutoFocus failed; PrimeNG autofocus behavior unchanged.',
      err
    )
  }
}
