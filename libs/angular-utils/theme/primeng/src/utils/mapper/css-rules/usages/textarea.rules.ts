import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

// TODO: resizing behaviour — .p-textarea { resize: vertical; } has no PrimeNG token.
// TODO: scrollbar styling — .p-textarea::-webkit-scrollbar { ... } has no PrimeNG token.

export const textareaCssRules: CssRule[] = [];
