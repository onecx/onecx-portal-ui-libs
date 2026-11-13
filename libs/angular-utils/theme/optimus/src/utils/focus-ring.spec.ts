import { contrastRatio, findAccessibleColor, parseColor, resolveFocusRingColors } from './focus-ring'
import defaultVariables from '../preset/default-theme-variables'
import presetVariables from '../preset/preset-variables'

const surfaces = [
  { name: 'surface', color: '#ffffff' },
  { name: 'body background', color: '#f7f7f7' },
]

const palettes: { name: string; primaryColor: string; topbarBgColor: string }[] = [
  {
    name: 'default theme',
    primaryColor: defaultVariables.general.primaryColor,
    topbarBgColor: defaultVariables.topbar.topbarBgColor,
  },
  { name: 'dark primary', primaryColor: '#14123a', topbarBgColor: '#14123a' },
  { name: 'light primary', primaryColor: '#ffe066', topbarBgColor: '#ffe066' },
  { name: 'high chroma', primaryColor: '#ff00ff', topbarBgColor: '#00ff00' },
]

describe('focus ring token resolver', () => {
  describe.each(palettes)('$name', ({ primaryColor, topbarBgColor }) => {
    const ring = resolveFocusRingColors({
      primaryColor,
      surfaceColor: '#ffffff',
      bodyBgColor: '#f7f7f7',
      topbarBgColor,
    })

    it.each(surfaces)('ring has at least 3:1 against the $name', ({ color }) => {
      expect(contrastRatio(ring.color, color)).toBeGreaterThanOrEqual(3)
    })

    it('inverse ring has at least 3:1 against the top bar background', () => {
      expect(contrastRatio(ring.inverseColor, topbarBgColor)).toBeGreaterThanOrEqual(3)
    })
  })

  it('keeps a primary colour that already has enough contrast', () => {
    expect(findAccessibleColor(parseColor('#274b5f')!, [[255, 255, 255]])).toBe('#274b5f')
  })

  it('falls back to black or white when no mix reaches the contrast', () => {
    // mid grey background: no colour reaches 3:1 on both sides, best of black / white is used
    const result = findAccessibleColor(
      [128, 128, 128],
      [
        [128, 128, 128],
        [120, 120, 120],
      ],
      21
    )
    expect(['#000000', '#ffffff']).toContain(result)
  })

  it('uses defaults for missing or unparsable colours', () => {
    const ring = resolveFocusRingColors({ primaryColor: 'not-a-color', topbarBgColor: null })
    expect(contrastRatio(ring.color, '#ffffff')).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(ring.inverseColor, '#0D3650')).toBeGreaterThanOrEqual(3)
  })

  describe('default preset', () => {
    const preset = presetVariables as any

    it('defines a 2px solid ring with an inverse token', () => {
      expect(preset.semantic.focusRing.width).toBe('2px')
      expect(preset.semantic.focusRing.style).toBe('solid')
      expect(preset.semantic.extend.onecx.focusRingInverseColor).toBeDefined()
      expect(contrastRatio(preset.semantic.focusRing.color, '#ffffff')).toBeGreaterThanOrEqual(3)
      expect(
        contrastRatio(preset.semantic.extend.onecx.focusRingInverseColor, defaultVariables.topbar.topbarBgColor)
      ).toBeGreaterThanOrEqual(3)
    })

    it('shows a ring on form fields in addition to the border change', () => {
      expect(preset.semantic.formField.focusRing.width).toBe('{focus.ring.width}')
      expect(preset.semantic.formField.focusRing.style).toBe('{focus.ring.style}')
    })

    it('uses the shared ring colour for all button severities', () => {
      const root = preset.components.button.colorScheme.light.root
      for (const severity of Object.keys(root)) {
        expect(root[severity].focusRing.color).toBe('{focus.ring.color}')
      }
    })
  })
})
