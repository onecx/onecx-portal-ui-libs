import { TestBed } from '@angular/core/testing'
import ThemeConfig from './theme-config'

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

  it('should generate config object with camel case variables', () => {
    const themeConfig = new ThemeConfig(themeVariables)

    const result = themeConfig.getConfig()
    expect(result.semantic.extend.onecx).toEqual({
      primaryColor: '#ababab',
      fontSize: '14px',
    })
  })
})
