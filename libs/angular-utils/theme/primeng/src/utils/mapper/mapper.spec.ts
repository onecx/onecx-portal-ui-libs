import type { ThemePropertiesV2 } from '@onecx/integration-interface';
import { mapThemeToPreset } from './mapper';
import type { MappingRule, CssRule, ThemePath, PresetPath } from './mapper.types';

/**
 * Scalar-typography consumption boundary tests.
 *
 * These exercise the real `mapThemeToPreset()` output (no mocking of the mapper) to prove that,
 * at the point a typography token becomes a PrimeNG preset value or a CSS `var()`, a scale object
 * or a dangling reference is reduced to a single scalar — or dropped entirely when the theme does
 * not supply the canonical token. The six `usages.content.font.*` leaves are used because the real
 * `content` usage consumes exactly that scalar font set, so the `from` paths are the same ones the
 * shipped CSS rules already reference.
 */

// The six global font properties and the preset/CSS slots they map to. `size`/`lineHeight` reduce
// to the `md` entry; `weight`/`letterSpacing` to `normal`; `family`/`style` are scalar (no entry).
interface Prop {
  fontKey: string;
  preset: string;
  css: string;
}
const PROPS: Prop[] = [
  { fontKey: 'size', preset: 'fontSize', css: 'font-size' },
  { fontKey: 'weight', preset: 'fontWeight', css: 'font-weight' },
  { fontKey: 'lineHeight', preset: 'lineHeight', css: 'line-height' },
  { fontKey: 'letterSpacing', preset: 'letterSpacing', css: 'letter-spacing' },
  { fontKey: 'family', preset: 'fontFamily', css: 'font-family' },
  { fontKey: 'style', preset: 'fontStyle', css: 'font-style' },
];

// Custom rules that only map the scalar font set, so assertions are not coupled to the shipped
// component tables. `semantic.*` target paths are unconstrained, and every `usages.content.font.*`
// `from` is a valid ThemePath (the shipped `content.rules.ts` already references them).
const FONT_RULES: MappingRule[] = PROPS.map((p) => ({
  from: `usages.content.font.${p.fontKey}` as ThemePath,
  to: `semantic.test.${p.preset}` as PresetPath,
}));
const FONT_CSS: CssRule[] = [
  {
    selector: '.ocx-test',
    declarations: PROPS.map((p) => ({
      property: p.css,
      from: `usages.content.font.${p.fontKey}` as ThemePath,
    })),
  },
];

// The legacy whole-property usage references — the form the `content` baseline uses — so a fixture
// only needs to describe the global `primitives.font` (and optionally override a usage leaf).
const LEGACY_USAGE_FONT = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
};

function makeTheme(font: Record<string, unknown>, usageOverride?: Record<string, unknown>) {
  const theme = {
    primitives: { font },
    usages: { content: { font: { ...LEGACY_USAGE_FONT, ...usageOverride } } },
  };
  return theme as unknown as ThemePropertiesV2;
}

function map(theme: ThemePropertiesV2) {
  return mapThemeToPreset(theme, FONT_RULES, FONT_CSS);
}

describe('mapThemeToPreset — scalar-typography consumption boundary', () => {
  describe('scale themes (a whole-property reference resolving to a scale object)', () => {
    const fullScale = {
      family: 'Inter, sans-serif',
      style: 'normal',
      size: { sm: '0.875rem', md: '1rem', lg: '1.125rem' },
      weight: { normal: '400', semibold: '600', bold: '700' },
      lineHeight: { sm: '1.25', md: '1.5', lg: '1.75' },
      letterSpacing: { tight: '-0.02em', normal: '0', wide: '0.05em' },
    };

    it('reduces each scale to its canonical entry and keeps the preset and CSS in agreement', () => {
      const { variables, css } = map(makeTheme(fullScale));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test).toEqual({
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
      });
      // Every emitted preset token has a matching CSS var(), and the CSS block is present.
      expect(css).toContain('.ocx-test');
      for (const p of PROPS) {
        const line = `  ${p.css}: var(--onecx-theme-usages-content-font-${p.fontKey});`;
        expect(css).toContain(line);
      }
    });

    it('never emits a scale object as a preset value', () => {
      const { variables } = map(makeTheme(fullScale));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      for (const p of PROPS) {
        const v = test.test[p.preset];
        expect(typeof v).toBe('string');
        expect(v).not.toEqual(expect.any(Object));
      }
    });

    it('selects the explicit named value when a usage references a specific named token', () => {
      // `{{primitives.font.size.sm}}` resolves to the explicit small value (not the canonical md).
      const { variables } = map(makeTheme(fullScale, { size: '{{primitives.font.size.sm}}' }));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test.fontSize).toBe('0.875rem');
      // The rest still resolve via the whole-property reference.
      expect(test.test.fontWeight).toBe('400');
      expect(test.test.lineHeight).toBe('1.5');
    });
  });

  describe('legacy scalar themes (global font properties are plain strings)', () => {
    const legacy = {
      family: 'Inter, sans-serif',
      style: 'normal',
      size: '1rem',
      weight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    };

    it('passes a whole-property reference to a scalar through unchanged', () => {
      const { variables } = map(makeTheme(legacy));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test).toEqual({
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
      });
    });

    it('interprets a canonical named reference against a scalar as that scalar baseline', () => {
      // `{{primitives.font.size.md}}` cannot resolve against a scalar, so it stays a reference; the
      // canonical leaf (`md`) falls back to the scalar itself.
      const { variables } = map(makeTheme(legacy, { size: '{{primitives.font.size.md}}' }));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test.fontSize).toBe('1rem');
    });

    it('does not synthesize a non-canonical named value from a scalar', () => {
      // `{{primitives.font.size.sm}}` against a scalar has no `sm` to draw from: it is unavailable,
      // so nothing is emitted (no invented small value) and the CSS line is omitted.
      const { variables, css } = map(makeTheme(legacy, { size: '{{primitives.font.size.sm}}' }));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test.fontSize).toBeUndefined();
      expect(css).not.toContain('font-size:');
    });
  });

  describe('missing canonical tokens (partial scales)', () => {
    it('excludes a scale that lacks its canonical entry from both the preset and the CSS', () => {
      // `size` has no `md` (the canonical entry for a bare size reference); `weight` has `normal`.
      const font = {
        family: 'Inter, sans-serif',
        style: 'normal',
        size: { sm: '0.875rem', lg: '1.125rem' }, // no md
        weight: { semibold: '600' }, // no normal
        lineHeight: { md: '1.5' },
        letterSpacing: { tight: '-0.02em', normal: '0' },
      };
      const { variables, css } = map(makeTheme(font));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      // Present canonical entries are emitted.
      expect(test.test.lineHeight).toBe('1.5');
      expect(test.test.letterSpacing).toBe('0');
      expect(test.test.fontFamily).toBe('Inter, sans-serif');
      // Absent canonical entries are excluded (not another entry, not a new value).
      expect(test.test.fontSize).toBeUndefined();
      expect(test.test.fontWeight).toBeUndefined();
      // The CSS omits the corresponding lines rather than emitting an unguarded var().
      expect(css).not.toContain('font-size:');
      expect(css).not.toContain('font-weight:');
      expect(css).toContain('line-height: var(--onecx-theme-usages-content-font-lineHeight);');
    });
  });

  describe('unresolved / dangling references', () => {
    it('emits nothing for a typography reference whose target does not exist', () => {
      // The reference targets a leaf that is not present; the resolver leaves it dangling and the
      // boundary must not write the raw reference as a typography value.
      const { variables, css } = map(makeTheme(
        { family: 'Inter, sans-serif', style: 'normal', size: '1rem', weight: '400', lineHeight: '1.5', letterSpacing: '0' },
        { size: '{{primitives.font.size.huge}}' },
      ));
      const test = variables.semantic as Record<string, Record<string, unknown>>;
      expect(test.test.fontSize).toBeUndefined();
      expect(css).not.toContain('font-size:');
      // The other tokens are unaffected.
      expect(test.test.fontWeight).toBe('400');
    });
  });

  describe('input immutability', () => {
    it('leaves the stored theme input untouched (references are not rewritten in place)', () => {
      const theme = makeTheme({
        family: 'Inter, sans-serif',
        style: 'normal',
        size: { md: '1rem' },
        weight: { normal: '400' },
        lineHeight: { md: '1.5' },
        letterSpacing: { normal: '0' },
      });
      const snapshot = JSON.stringify(theme);
      map(theme);
      // The input is the source of truth: its usage references and scale objects are unchanged.
      expect(JSON.stringify(theme)).toBe(snapshot);
      expect((theme as any).usages.content.font.size).toBe('{{primitives.font.size}}');
      expect((theme as any).primitives.font.size).toEqual({ md: '1rem' });
    });
  });

  describe('non-typography object references are unchanged', () => {
    it('writes a non-typography object value verbatim (no scalar reduction)', () => {
      const rules: MappingRule[] = [{ from: 'usages.content.background' as ThemePath, to: 'semantic.test.background' as PresetPath }];
      const theme = makeTheme({ family: 'Inter, sans-serif', style: 'normal', size: '1rem', weight: '400', lineHeight: '1.5', letterSpacing: '0' });
      (theme as any).usages.content.background = { color: '#ffffff' };
      const { variables } = mapThemeToPreset(theme, rules, []);
      // `background` is not a typography path: the object passes through unchanged (getByPath).
      expect((variables.semantic as Record<string, unknown>).test).toEqual({
        background: { color: '#ffffff' },
      });
    });
  });

  describe('successive configurations do not leak prior typography', () => {
    it('recomputes output from the supplied theme only', () => {
      const rules = FONT_RULES;
      const cssRules = FONT_CSS;
      // A full scale theme, then a legacy scalar theme through the same (unmodified) rules.
      const first = mapThemeToPreset(
        makeTheme({ family: 'A', style: 'normal', size: { md: '1rem' }, weight: { normal: '400' }, lineHeight: { md: '1.5' }, letterSpacing: { normal: '0' } }),
        rules,
        cssRules,
      );
      const second = mapThemeToPreset(
        makeTheme({ family: 'B', style: 'italic', size: '2rem', weight: '700', lineHeight: '2', letterSpacing: '0.1em' }),
        rules,
        cssRules,
      );
      const firstTest = (first.variables.semantic as Record<string, Record<string, unknown>>).test;
      const secondTest = (second.variables.semantic as Record<string, Record<string, unknown>>).test;
      expect(firstTest.fontFamily).toBe('A');
      expect(firstTest.fontSize).toBe('1rem');
      // The second configuration reflects only its own values — no leakage of the first.
      expect(secondTest.fontFamily).toBe('B');
      expect(secondTest.fontStyle).toBe('italic');
      expect(secondTest.fontSize).toBe('2rem');
      expect(secondTest.fontWeight).toBe('700');
      expect(secondTest.lineHeight).toBe('2');
      expect(secondTest.letterSpacing).toBe('0.1em');
    });
  });
});
