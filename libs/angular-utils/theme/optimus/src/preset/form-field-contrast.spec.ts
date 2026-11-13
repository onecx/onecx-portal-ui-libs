/**
 * WCAG 1.4.11 (non-text contrast) for form field boundaries.
 *
 * axe-core cannot test this in jsdom: jsdom does not resolve the PrimeNG/Optimus design tokens into
 * computed CSS (no stylesheet cascade, no CSS custom properties), so `color-contrast`-style rules do not
 * evaluate borders there and 1.4.11 is not covered by axe at all. Therefore the contrast is verified here
 * on the resolved preset tokens instead.
 */
import { CustomPreset } from './custom-preset'

type Tokens = Record<string, any>

const WHITE = '#ffffff'
const BODY_BACKGROUND = '#f7f7f7'
const MIN_BOUNDARY_CONTRAST = 3
const MIN_HOVER_DIFFERENCE = 1.5

const preset = CustomPreset as unknown as Tokens
const light: Tokens = preset['semantic'].colorScheme.light

function lookup(root: Tokens, path: string): unknown {
  return path.split('.').reduce<any>((node, segment) => node?.[segment], root)
}

/** Resolves `{a.b.c}` references (semantic tokens, light scheme first) until a color literal remains. */
function resolve(value: unknown, depth = 0): string {
  if (typeof value !== 'string') throw new Error(`Token is not a string: ${String(value)}`)
  if (depth > 10) throw new Error(`Circular token reference: ${value}`)
  const reference = /^\{(.+)\}$/.exec(value)
  if (!reference) return value
  const path = reference[1]
  const target = lookup(light, path) ?? lookup(preset['semantic'], path)
  if (target === undefined) throw new Error(`Unresolvable token reference: ${value}`)
  return resolve(target, depth + 1)
}

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) throw new Error(`Not a 6 digit hex color: ${hex}`)
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const components = preset['components'] as Tokens

// component -> [default border token path, hover border token path]; the preset keys are normalized
// (camelCase split into nested objects), e.g. `borderColor` is `border.color`
const formFieldTokens: Record<string, [string, string]> = {
  'form field': ['form.field.border.color', 'form.field.hover.border.color'],
}
for (const name of ['inputtext', 'textarea', 'select', 'multiselect', 'checkbox', 'radiobutton']) {
  formFieldTokens[name] = [`${name}.root.border.color`, `${name}.root.hover.border.color`]
}

function tokenOf(name: string, path: string): string {
  if (name === 'form field') return resolve(lookup(light, path))
  return resolve(lookup(components, path))
}

describe('form field border contrast (WCAG 1.4.11)', () => {
  it('should resolve the preset tokens to color literals', () => {
    expect(Object.keys(formFieldTokens).length).toBeGreaterThan(1)
    for (const [name, [border, hover]] of Object.entries(formFieldTokens)) {
      expect(tokenOf(name, border)).toMatch(/^#[0-9a-f]{6}$/i)
      expect(tokenOf(name, hover)).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  describe.each(Object.entries(formFieldTokens))('%s', (name, [border, hover]) => {
    it.each([
      ['white', WHITE],
      ['the default body background', BODY_BACKGROUND],
    ])(`border should have at least ${MIN_BOUNDARY_CONTRAST}:1 contrast against %s`, (_label, background) => {
      expect(contrast(tokenOf(name, border), background)).toBeGreaterThanOrEqual(MIN_BOUNDARY_CONTRAST)
    })

    it(`hover border should differ from the default border by at least ${MIN_HOVER_DIFFERENCE}:1`, () => {
      expect(contrast(tokenOf(name, border), tokenOf(name, hover))).toBeGreaterThanOrEqual(MIN_HOVER_DIFFERENCE)
    })
  })

  it('should not be overridden by a component specific border color for inputtext', () => {
    expect(components['inputtext'].root.border?.color).toBe('{form.field.border.color}')
  })
})
