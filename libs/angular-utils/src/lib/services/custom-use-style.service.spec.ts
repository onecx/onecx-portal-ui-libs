import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { CustomUseStyle, SKIP_STYLE_SCOPING } from './custom-use-style.service'
import { DOCUMENT } from '@angular/common'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-remote-components'
import { ReplaySubject } from 'rxjs'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AppStateService, MfeInfo } from '@onecx/angular-integration-interface'
import { THEME_OVERRIDES } from '../theme/application-config'
import { shellScopeId } from '../utils/scope.utils'

class ElementMock {
  // extension
  tagName: string
  // Element data
  isConnected = false
  textContent = ''
  attribute = ''
  constructor(tagName: string) {
    this.tagName = tagName
  }

  setAttribute(attr: string, value: string) {
    this.attribute = `${attr}="${value}"`
  }
}

function removeSpacesAndNewlines(str?: string) {
  return str?.replace(/\s+/g, '')
}

jest.mock('@primeuix/utils', () => ({
  setAttribute: (element: ElementMock, attribute: string, value: string) => {
    element.setAttribute(attribute, value)
  },
  setAttributes: jest.fn(),
}))

describe('CustomUseStyleService', () => {
  let service: CustomUseStyle
  let styleList: Array<ElementMock> = []
  let mockOverrides = {}

  const documentMock: Partial<Document> = {
    querySelector(selectors: string) {
      return styleList.find((s) => `style[${s.attribute}]` === selectors) ?? null
    },
    createElement(tagName: string) {
      return new ElementMock(tagName) as any as HTMLElement
    },
    head: {
      appendChild(node: ElementMock) {
        styleList.push(node)
        node.isConnected = true
      },
    } as HTMLHeadElement,
  }

  const configureShell = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SKIP_STYLE_SCOPING,
          useValue: true,
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
  }

  const configureRemoteComponent = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: REMOTE_COMPONENT_CONFIG,
          useValue: new ReplaySubject<RemoteComponentConfig>(1),
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const config = TestBed.inject(REMOTE_COMPONENT_CONFIG)
    config.next({
      appId: 'test-ui',
      productName: 'test',
      permissions: [],
      baseUrl: 'test',
    })
  }

  const configureMfe = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        provideAppStateServiceMock(),
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const appStateService = TestBed.inject(AppStateService)
    appStateService.currentMfe$.publish({
      appId: 'test-ui',
      productName: 'test',
    } as MfeInfo)
  }

  const removeScopeRule = () => {
    delete (global as any).CSSScopeRule
  }

  const setScopeRule = () => {
    ;(global as any).CSSScopeRule = 'CSSScopeRule'
  }

  beforeEach(() => {
    setScopeRule()
  })

  afterEach(() => {
    styleList = []
    mockOverrides = {}
    removeScopeRule()
  })

  describe('for Shell', () => {
    beforeEach(() => {
      configureShell()
    })

    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab';}"
      const expectedCss = ":root{--p-primary-color: '#ababab';}"
      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(styleList.at(0)?.textContent).toEqual(expectedCss)
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([data-style-id="${shellScopeId}"]) to ([data-style-isolation]) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @supports (@scope([data-style-id="${shellScopeId}"]) to ([data-style-isolation])) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = ':root{--p-primary-color:red;}'
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))
  })

  describe('for Remote Component', () => {
    beforeEach(() => {
      configureRemoteComponent()
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = ":root{--test-test-ui-primary-color: '#ababab'}"

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(styleList.at(0)?.textContent).toEqual(expectedCss)
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @scope([data-style-id="test|test-ui"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                .p-button{display:inline-flex;color:var(--test-test-ui-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @supports (@scope([data-style-id="test|test-ui"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                .p-button{display:inline-flex;color:var(--test-test-ui-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))
  })

  describe('for MFE', () => {
    beforeEach(() => {
      configureMfe()
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = ":root{--test-test-ui-primary-color: '#ababab'}"

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(styleList.at(0)?.textContent).toEqual(expectedCss)
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @scope([data-style-id="test|test-ui"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                      .p-button{display:inline-flex;color:var(--test-test-ui-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @supports (@scope([data-style-id="test|test-ui"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                      .p-button{display:inline-flex;color:var(--test-test-ui-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))
  })

  describe('overrides', () => {
    it('should accept object with overrides', fakeAsync(() => {
      configureMfe()
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))

    it('should accept Promise with overrides', fakeAsync(() => {
      const overrides = Promise.resolve({
        semantic: {
          primaryColor: 'red',
        },
      })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))

    it('should accept function returning object with overrides', fakeAsync(() => {
      const overrides = () => {
        return {
          semantic: {
            primaryColor: 'red',
          },
        }
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))

    it('should accept function returning Promise with overrides', fakeAsync(() => {
      const overrides = () =>
        Promise.resolve({
          semantic: {
            primaryColor: 'red',
          },
        })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = ':root{--test-test-ui-primary-color:red;}'

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(styleList.at(1)?.textContent).toEqual(expectedOverrideCss)
    }))
  })

  describe('style element update', () => {
    it('should update existing style tag wih new css', fakeAsync(() => {
      configureMfe()
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = ":root{--test-test-ui-primary-color: '#ababab'}"

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(styleList.at(0)?.textContent).toEqual(expectedCss)

      const newCss = ":root{--p-primary-color: '#aabbcc'}"
      const newExpectedCss = ":root{--test-test-ui-primary-color: '#aabbcc'}"

      service.use(newCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(styleList.at(0)?.textContent).toEqual(newExpectedCss)
    }))
  })
})
