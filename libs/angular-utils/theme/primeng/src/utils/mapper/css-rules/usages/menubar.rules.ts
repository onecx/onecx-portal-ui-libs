import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

// TODO: root border width and root box-shadow on .p-menubar have no PrimeNG preset tokens.
// TODO: submenu item typography and per-item colors/backgrounds require item-level selectors; the preset exposes only submenu container and icon tokens.

export const menubarCssRules: CssRule[] = [];