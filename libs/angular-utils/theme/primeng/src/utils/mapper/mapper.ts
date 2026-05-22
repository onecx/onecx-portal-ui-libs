import type { Theme } from '@onecx/integration-interface';
import type { MappingRule, CssRule } from './mapper.types';
import { resolveThemeRefs } from './resolve-refs';
import { getByPath, setByPath, cssVar, isLightDark } from './mapper.utils';
import { MAPPING_RULES } from './mapping-rules';
import { CSS_RULES } from './css-rules';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODE_PLACEHOLDER = '{mode}' as const;
const MODES = ['light', 'dark'] as const;

/**
 * Expands a `to` dot-path that contains `{mode}` into two concrete paths —
 * one for `light` and one for `dark`.
 *
 * When the value is a `{ light, dark }` colour object, the respective variant
 * is used for each mode.  Otherwise the same value is written to both.
 */
function applyModeRule(
  preset: Record<string, unknown>,
  to: string,
  value: unknown
): void {
  for (const mode of MODES) {
    const path = to.replace(MODE_PLACEHOLDER, mode);
    const modeValue = isLightDark(value) ? value[mode] : value;
    if (modeValue !== undefined) {
      setByPath(preset, path, modeValue);
    }
  }
}

/**
 * Applies a single mapping rule to the preset output object.
 * Skips the rule when the transformed value is `undefined` (e.g. a transform
 * returned `undefined` to signal an inapplicable value type).
 */
function applyMappingRule(
  rule: MappingRule,
  resolved: unknown,
  preset: Record<string, unknown>
): void {
  let value = getByPath(resolved, rule.from);
  if (value === undefined) return;

  if (rule.transform) {
    value = rule.transform(value);
    if (value === undefined) return;
  }

  if (rule.to.includes(MODE_PLACEHOLDER)) {
    applyModeRule(preset, rule.to, value);
  } else {
    setByPath(preset, rule.to, value);
  }
}

/**
 * Builds the CSS string from the list of CSS rules.
 *
 * Each `CssDeclaration` with a `from` path is emitted only when the resolved
 * theme contains a value at that path.  Declarations with a static `value` are
 * always emitted.  An entire selector block is omitted when none of its
 * declarations contribute any output.
 */
function buildCss(cssRules: CssRule[], resolved: unknown): string {
  const blocks: string[] = [];

  for (const rule of cssRules) {
    const lines: string[] = [];

    for (const decl of rule.declarations) {
      if (decl.value !== undefined) {
        // Static / structural declaration — always emit.
        lines.push(`  ${decl.property}: ${decl.value};`);
      } else if (decl.from !== undefined) {
        const themeValue = getByPath(resolved, decl.from);
        if (themeValue !== undefined) {
          lines.push(`  ${decl.property}: ${cssVar(decl.from)};`);
        }
      }
    }

    if (lines.length > 0) {
      blocks.push(`${rule.selector} {\n${lines.join('\n')}\n}`);
    }
  }

  return blocks.join('\n\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Maps an OneCX theme object (v2 schema) to a PrimeNG preset and a companion
 * CSS string.
 *
 * 1. All `{{ref}}` references in the theme are resolved via `resolveThemeRefs`.
 * 2. Each `MappingRule` in `MAPPING_RULES` writes a resolved value to the
 *    corresponding dot-path in the preset output.
 * 3. Each `CssRule` in `CSS_RULES` contributes declarations for token
 *    properties that have no PrimeNG preset equivalent.  CSS values use
 *    `var(--onecx-theme-{path})` custom properties (populated separately by the
 *    OneCX CSS variable injection function).
 *
 * The returned `preset` is a **plain object** — wrap it with `definePreset` if
 * you want to layer it on top of a base preset such as Aura:
 *
 * ```ts
 * import { definePreset } from '@primeuix/themes';
 * import Aura from '@primeuix/themes/aura';
 *
 * const { preset, css } = mapThemeToPreset(myTheme);
 * const finalPreset = definePreset(Aura, { ...preset, css });
 *
 * providePrimeNG({ theme: { preset: finalPreset } });
 * ```
 *
 * @param theme - A raw OneCX v2 theme object (may contain `{{path}}` refs).
 * @param mappingRules - Override the default MAPPING_RULES (for testing /
 *   extension without modifying the shared table).
 * @param cssRules - Override the default CSS_RULES.
 * @returns `{ preset, css }` where `preset` is a plain object whose shape
 *   matches PrimeNG's `Preset` structure and `css` is the companion CSS string
 *   for unmappable styles.  Use `as unknown as Preset` when passing to
 *   `definePreset` to satisfy TypeScript's strict index-signature check on the
 *   `Preset` type.
 */
export function mapThemeToPreset(
  theme: Theme,
  mappingRules: MappingRule[] = MAPPING_RULES,
  cssRules: CssRule[] = CSS_RULES
): { preset: Record<string, unknown>; css: string } {
  const resolved = resolveThemeRefs(theme);
  const presetObj: Record<string, unknown> = {};

  for (const rule of mappingRules) {
    applyMappingRule(rule, resolved, presetObj);
  }

  const css = buildCss(cssRules, resolved);

  return { preset: presetObj, css };
}
