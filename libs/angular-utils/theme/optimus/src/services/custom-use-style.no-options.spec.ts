import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'
import { CustomUseStyle } from './custom-use-style.service'
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
import { ElementMock } from './element-mock'

function removeSpacesAndNewlines(str?: string) {
  return str?.replace(/\s+/g, '')
}

const setScopeRule = () => {
  const globals = globalThis as Record<string, unknown>
  globals['CSSScopeRule'] = 'CSSScopeRule'
}

describe('CustomUseStyleService without options', () => {
  let service: CustomUseStyle
  let styleList: Array<ElementMock> = []
  let mockOverrides = {}

  const documentMock = {
    querySelector(selectors: string) {
      return styleList.find((s) => `style[${s.attribute}]` === selectors) ?? null
    },
    createElement(_tagName: string) {
      return new ElementMock()
    },
    head: {
      appendChild(node: ElementMock) {
        styleList.push(node)
        node.isConnected = true
      },
    },
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

  beforeEach(() => {
    setScopeRule()
  })

  afterEach(() => {
    styleList = []
    mockOverrides = {}
  })

  describe('given a shell-scoped app', () => {
    beforeEach(() => {
      configureShell()
    })

    it('when use is called without options, then it does not throw and returns a response object', () => {
      const css = '.p-button{display:inline-flex}'

      let result: { id: unknown; css: unknown } | undefined
      expect(() => {
        result = service.use(css)
      }).not.toThrow()

      expect(result).toBeDefined()
      expect(result?.css).toBe(css)
      expect(result?.id).toBeUndefined()
    })

    it('when use is called without options and the scope resolves, then the style is registered in the document', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
              ${css}
          }
      `

      service.use(css)

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))
  })

  describe('given an MFE-scoped app', () => {
    let styleId: string
    let prefix: string

    beforeEach(() => {
      configureMfe()
      styleId = 'test|test-ui'
      prefix = 'test-test-ui'
    })

    it('when use is called without options and the scope resolves, then the style is registered with the scoped css', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
              .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
      `

      service.use(css)

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))
  })
})
