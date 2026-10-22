import defaultThemeVariables from '../preset/default-theme-variables'
import { CustomPreset } from '../preset/custom-preset'
import { contrastRatio } from './focus-ring'
import {
  MIN_ICON_CONTRAST,
  MIN_TEXT_CONTRAST,
  THEME_COLOR_PAIRS,
  ThemeColorPair,
  checkThemeContrast,
  warnOnLowThemeContrast,
} from './theme-contrast'

/*
 * axe-core cannot evaluate these pairs in jsdom (no resolved CSS custom properties), the declared theme
 * variables are therefore checked directly.
 */
describe('theme contrast guard', () => {
  const defaults = defaultThemeVariables as any

  it('should declare pairs that all resolve in the default theme', () => {
    const resolvable = THEME_COLOR_PAIRS.filter((pair) => {
      const [fgSection, fgName] = pair.foreground.split('.')
      const [bgSection, bgName] = pair.background.split('.')
      return defaults[fgSection]?.[fgName] && defaults[bgSection]?.[bgName]
    })
    expect(resolvable).toHaveLength(THEME_COLOR_PAIRS.length)
  })

  describe.each(THEME_COLOR_PAIRS.map((pair) => [pair.name, pair] as const))('default pair "%s"', (_name, pair) => {
    it('should reach the minimum contrast', () => {
      expect(checkThemeContrast(defaults, { pairs: [pair] })).toEqual([])
    })
  })

  it('should find no problem in the default theme', () => {
    expect(checkThemeContrast(defaults)).toEqual([])
  })

  it('should not accept the former default hover colours (1.21:1 and 2.17:1)', () => {
    const findings = checkThemeContrast(
      {
        sidebar: { menuItemHoverBgColor: '#d0021b' },
        general: { hoverBgColor: '#ad1457' },
        topbar: {},
      },
      { defaults }
    )
    expect(findings.map((f) => f.pair.name)).toEqual(['hovered content text', 'menu item hover text'])
    expect(findings.find((f) => f.pair.name === 'menu item hover text')?.ratio).toBeCloseTo(1.21, 1)
  })

  it('should read kebab-case theme DB variables and fall back to the defaults', () => {
    const findings = checkThemeContrast(
      { topbar: { 'topbar-bg-color': '#ffffff' }, general: {}, sidebar: {} },
      { defaults }
    )
    expect(findings.map((f) => f.pair.name)).toEqual(
      expect.arrayContaining(['top bar text', 'top bar item text', 'top bar icon'])
    )
    expect(findings.find((f) => f.pair.name === 'top bar icon')?.required).toBe(MIN_ICON_CONTRAST)
    expect(findings.find((f) => f.pair.name === 'top bar text')?.required).toBe(MIN_TEXT_CONTRAST)
  })

  it('should blend translucent colours over their backdrop', () => {
    const pair = THEME_COLOR_PAIRS.find((p) => p.name === 'active menu item text') as ThemeColorPair
    expect(
      checkThemeContrast(
        { sidebar: { menuActiveItemTextColor: '#515c66', menuActiveItemBgColor: 'rgba(0, 0, 0, 0.04)' } },
        { pairs: [pair], defaults }
      )
    ).toEqual([])
    expect(
      checkThemeContrast(
        { sidebar: { menuActiveItemTextColor: '#515c66', menuActiveItemBgColor: 'rgba(0, 0, 0, 0.6)' } },
        { pairs: [pair], defaults }
      )
    ).toHaveLength(1)
  })

  it('should skip pairs with unparsable colours', () => {
    expect(checkThemeContrast({ general: { textColor: 'var(--foo)' } }, { defaults })).toEqual([])
  })

  describe('warnOnLowThemeContrast', () => {
    it('should warn once, listing the failing pairs, for a failing theme override', () => {
      const logger = { warn: jest.fn() }
      const findings = warnOnLowThemeContrast(
        { general: { 'text-color': '#cccccc', 'content-bg-color': '#ffffff' } },
        logger,
        defaults
      )
      expect(findings.length).toBeGreaterThan(0)
      expect(logger.warn).toHaveBeenCalledTimes(1)
      expect(logger.warn.mock.calls[0][0]).toContain('content text')
      expect(logger.warn.mock.calls[0][0]).toContain('4.5:1')
    })

    it('should not warn for the default theme', () => {
      const logger = { warn: jest.fn() }
      expect(warnOnLowThemeContrast({}, logger, defaults)).toEqual([])
      expect(logger.warn).not.toHaveBeenCalled()
    })
  })

  describe('preset tokens', () => {
    const light = (CustomPreset as any).semantic.colorScheme.light

    it('should keep form field icons, text and placeholders readable on the form field background', () => {
      // resolved surface values, see form-field-contrast.spec.ts for the border
      const surface = light.surface
      const background = surface[0]
      expect(light.form.field.icon.color).toBe('{surface.400}')
      expect(contrastRatio(surface[400], background)).toBeGreaterThanOrEqual(MIN_ICON_CONTRAST)
      expect(light.form.field.placeholder.color).toBe('{surface.500}')
      expect(contrastRatio(surface[500], background)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
      expect(light.form.field.color).toBe('{surface.700}')
      expect(contrastRatio(surface[700], background)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    })
  })
})
