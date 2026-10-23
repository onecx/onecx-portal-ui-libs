import * as path from 'node:path'
import { contrastRatio, parseColor } from './focus-ring'

const sass = require('sass')

const themeScss = path.join(__dirname, 'theme-onecx', 'theme.scss')

type Rule = { selector: string; declarations: Record<string, string> }

function parseRules(css: string): Rule[] {
  const rules: Rule[] = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css))) {
    const declarations: Record<string, string> = {}
    for (const decl of m[2].split(';')) {
      const i = decl.indexOf(':')
      if (i > 0) declarations[decl.slice(0, i).trim()] = decl.slice(i + 1).trim()
    }
    // drop leading comments and at-rule prefixes
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
    rules.push({ selector, declarations })
  }
  return rules
}

describe('React theme focus styles', () => {
  let css: string
  let rules: Rule[]

  beforeAll(() => {
    css = sass.compile(themeScss, { quietDeps: true, silenceDeprecations: ['import'], logger: sass.Logger.silent }).css
    rules = parseRules(css)
  })

  it('uses an opaque, theme driven ring colour with a dark fallback of at least 3:1', () => {
    const m = /outline:\s*2px solid var\(--app-focus-ring-color,\s*(#[0-9a-f]{6})\)/.exec(css)
    expect(m).not.toBeNull()
    const fallback = parseColor(m![1])!
    expect(contrastRatio(fallback, parseColor('#ffffff')!)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(fallback, parseColor('#f7f7f7')!)).toBeGreaterThanOrEqual(3)
  })

  it('draws the focus ring as outline, which survives forced-colors mode', () => {
    const focusRules = rules.filter((r) => /:focus(-visible)?|\.p-focus/.test(r.selector) && r.declarations['outline'])
    expect(focusRules.length).toBeGreaterThan(40)
    const rings = focusRules.filter((r) => r.declarations['outline'] !== '0 none')
    expect(rings.length).toBeGreaterThan(40)
    for (const r of rings) {
      expect(r.declarations['outline']).toMatch(/^2px solid var\(--app-focus-ring-color/)
    }
  })

  it('does not replace the ring by a (pale) box-shadow on buttons', () => {
    const buttonFocus = rules.filter((r) => /\.p-button[^,]*:focus$/.test(r.selector.trim()))
    expect(buttonFocus.length).toBeGreaterThan(0)
    for (const r of buttonFocus) {
      expect(r.declarations['box-shadow'] ?? 'none').toBe('none')
    }
  })

  it('only removes the outline where focus is shown elsewhere (hidden native inputs, composite widgets with focused items)', () => {
    const allowed = [
      /p-(checkbox|radiobutton|togglebutton|inputswitch)-input$/, // visually hidden native input, the box shows the ring via :has(:focus-visible)
      /p-(chips-input-token) input$/, // inner input of the chips field, the field shows the ring
      /p-(dropdown|cascadeselect)-label/, // inner label, the field shows the ring via .p-focus
      /-(list|root-list|list-container)$/, // composite widget list, focused item shows the ring
      /p-treenode$/, // focused content shows the ring
      /p-panelmenu-header$/, // header content shows the ring
      /p-dock-list$/,
      /p-chip-remove-icon:focus:not\(:focus-visible\)$/, // only mouse focus
    ]
    const removed = rules.filter((r) => r.declarations['outline'] === '0 none')
    expect(removed.length).toBeGreaterThan(0)
    for (const r of removed) {
      const selectors = r.selector.split(',').map((s) => s.trim())
      for (const s of selectors) {
        expect({ selector: s, ok: allowed.some((a) => a.test(s)) }).toEqual({ selector: s, ok: true })
      }
    }
  })

  it('shows a ring on focused list and menu items', () => {
    const itemFocus = rules.filter(
      (r) =>
        /\.p-(listbox|dropdown|multiselect|picklist|orderlist)[^,]*\.p-focus$/.test(r.selector) &&
        r.declarations['outline']
    )
    expect(itemFocus.length).toBeGreaterThan(0)
    expect(rules.some((r) => /\.p-focus > \.p-menuitem-content$/.test(r.selector) && r.declarations['outline'])).toBe(
      true
    )
  })

  it('has input borders with at least 3:1 contrast against white', () => {
    const borders = rules
      .filter((r) => /^\.p-(inputtext|dropdown|multiselect|cascadeselect|listbox)$/.test(r.selector.trim()))
      .map((r) => r.declarations['border'])
      .filter(Boolean)
    expect(borders.length).toBeGreaterThan(0)
    for (const border of borders) {
      const color = /#[0-9a-f]{6}/i.exec(border)?.[0]
      expect(color).toBeDefined()
      expect(contrastRatio(parseColor(color)!, parseColor('#ffffff')!)).toBeGreaterThanOrEqual(3)
    }
    for (const sel of ['.p-checkbox .p-checkbox-box', '.p-radiobutton .p-radiobutton-box']) {
      const border = rules.find((r) => r.selector.trim() === sel && r.declarations['border'])?.declarations['border']
      const color = /#[0-9a-f]{6}/i.exec(border ?? '')?.[0]
      expect(color).toBeDefined()
      expect(contrastRatio(parseColor(color!)!, parseColor('#ffffff')!)).toBeGreaterThanOrEqual(3)
    }
  })
})
