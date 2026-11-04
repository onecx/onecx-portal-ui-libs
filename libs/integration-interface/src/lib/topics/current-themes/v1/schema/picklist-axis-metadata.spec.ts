import { collectAxisScopes } from './test-utils'

const PICKLIST = 'v2.usages.picklist'

// The picklist is a static container: the root holds a flat baseline token set (background/color/
// gap) beside its child components (panel, the three control-button groups) and a behavioral
// settings block — none of it is a `defaultVariant` axis. The item's per-item states are modeled
// flat (default-state tokens spread alongside named hover/selected/focus/disabled) with no
// canonical `defaultState` wrapper, so there is no variant/state/severity chain to relax.
// Zero fallback scopes is correct.
describe('picklist axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(PICKLIST).size).toBe(0)
  })
})
