import { TestBed } from '@angular/core/testing'
import ThemeConfig from './theme-config'
import { contrastRatio } from './focus-ring'

describe('ThemeConfig', () => {
  const themeVariables = {
    general: {
      'primary-color': '#ababab',
    },
    font: {
      'font-size': '14px',
    },
    topbar: {},
    sidebar: {},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    })
  })

  it('should generate config object with normalized variables', () => {
    const themeConfig = new ThemeConfig(themeVariables)

    const result = themeConfig.getConfig()
    expect(contrastRatio(result['semantic'].extend.onecx.focus.ring.color, '#ffffff')).toBeGreaterThanOrEqual(3)
    expect(result['semantic'].extend.onecx).toEqual({
      primary: { color: '#ababab' },
      font: { size: '14px' },
      focus: {
        ring: {
          color: expect.stringMatching(/^#[0-9a-f]{6}$/),
          inverse: { color: expect.stringMatching(/^#[0-9a-f]{6}$/) },
        },
      },
    })
  })

  it('should resolve the focus ring colour with at least 3:1 contrast for the theme colours', () => {
    const themeConfig = new ThemeConfig({
      ...themeVariables,
      general: { 'primary-color': '#ffe066', 'content-bg-color': '#ffffff', 'body-bg-color': '#f7f7f7' },
      topbar: { 'topbar-bg-color': '#0D3650' },
    })

    const result = themeConfig.getConfig()
    const ring = result['semantic'].focus.ring.color as string
    expect(ring).toBe(result['semantic'].extend.onecx.focus.ring.color)
    expect(contrastRatio(ring, '#ffffff')).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(ring, '#f7f7f7')).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(result['semantic'].extend.onecx.focus.ring.inverse.color, '#0D3650')).toBeGreaterThanOrEqual(3)
  })
})
