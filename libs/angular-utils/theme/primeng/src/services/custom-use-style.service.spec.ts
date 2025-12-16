import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { CustomUseStyle } from './custom-use-style.service'
import { DOCUMENT } from '@angular/common'
import { ReplaySubject } from 'rxjs'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AppStateService, MfeInfo } from '@onecx/angular-integration-interface'
import { THEME_OVERRIDES } from '../utils/application-config'
import {
  dataNoPortalLayoutStylesAttribute,
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  shellScopeId,
  SKIP_STYLE_SCOPING,
} from '@onecx/angular-utils'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { RemoteComponentConfig } from '@onecx/angular-utils'

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
  setAttributes: (element: ElementMock, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
  },
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
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
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
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
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
      const expectedCss = `@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color: '#ababab';}}`
      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
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
      @supports (@scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="shell-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for Remote Component', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureRemoteComponent()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
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
            @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for MFE', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureMfe()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
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
                  @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('overrides', () => {
    it('should accept object with overrides', fakeAsync(() => {
      const { prefix } = configureMfe()
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
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
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('style element update', () => {
    it('should update existing style tag wih new css', fakeAsync(() => {
      const { styleId, prefix } = configureMfe()
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))

      const newCss = ":root{--p-primary-color: '#aabbcc'}"
      const newExpectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#aabbcc'}}`

      service.use(newCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(newExpectedCss))
    }))
  })
})
