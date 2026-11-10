// Runs before zone.js is loaded (jest `setupFiles`).
// zone.js wraps MutationObserver and drops the non-enumerable class methods of happy-dom's
// implementation (`observe is not a function`), which breaks axe-core (used by expectNoAxeViolations)
// when it is loaded. MutationObserver callbacks do not need to be zone-aware in unit tests.
;(globalThis as any).__Zone_disable_MutationObserver = true
