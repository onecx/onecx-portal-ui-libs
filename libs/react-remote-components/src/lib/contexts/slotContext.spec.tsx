import { FC, useContext } from 'react'
import { render } from '@testing-library/react'
import { firstValueFrom } from 'rxjs'
import { getShellMfInstance as getShellMfInstanceOriginal } from '../utils/getShellMfInstance'
import { SlotProvider, SlotContext } from './slotContext'

jest.mock('@onecx/integration-interface', () => {
  const { BehaviorSubject } = require('rxjs')
  const subject = new BehaviorSubject({ slots: [], components: [] })
  return {
    RemoteComponentsTopic: jest.fn(() => subject),
    __mockSubject: subject,
    Technologies: {
      Angular: 'ANGULAR',
      React: 'REACT',
      WebComponentModule: 'WEB_COMPONENT_MODULE',
    },
  }
})

jest.mock('../utils/getShellMfInstance', () => ({
  getShellMfInstance: jest.fn(),
}))

jest.mock('../hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({
    getPermissions: jest.fn(() => Promise.resolve(['perm1', 'perm2'])),
  })),
}))

jest.mock('../utils/logger.utils', () => ({
  createLogger: jest.fn(() => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  })),
}))

const getShellMfInstance = getShellMfInstanceOriginal as jest.Mock

function getRemoteComponentsSubject() {
  return (jest.requireMock('@onecx/integration-interface') as any).__mockSubject
}

function mockShellInstance(overrides: Record<string, any> = {}) {
  const instance = {
    name: 'onecx-shell-ui',
    registerRemotes: jest.fn(),
    loadRemote: jest.fn(),
    ...overrides,
  }
  getShellMfInstance.mockReturnValue(instance)
  return instance
}

function renderAndCaptureContext() {
  let captured: any
  const TestComponent: FC = () => {
    captured = useContext(SlotContext)
    return null
  }
  render(
    <SlotProvider>
      <TestComponent />
    </SlotProvider>
  )
  return { getContext: () => captured }
}

describe('SlotContext', () => {
  it('should be defined', () => {
    expect(SlotContext).toBeDefined()
  })
})

describe('SlotProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getRemoteComponentsSubject().next({ slots: [], components: [] })
  })

  it('should be a function component', () => {
    expect(typeof SlotProvider).toBe('function')
  })

  it('should provide context with expected shape', () => {
    mockShellInstance()
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()
    expect(ctx).toBeDefined()
    expect(typeof ctx.getComponentsForSlot).toBe('function')
    expect(typeof ctx.isSomeComponentDefinedForSlot).toBe('function')
    expect(typeof ctx.loadComponent).toBe('function')
  })

  describe('getComponentsForSlot', () => {
    it('should return empty array when shellMfInstance is not available', async () => {
      getShellMfInstance.mockReturnValue(undefined)
      const { getContext } = renderAndCaptureContext()
      const result = await firstValueFrom(getContext().getComponentsForSlot('test-slot'))
      expect(result).toEqual([])
    })

    it('should return empty array for unknown slot when shellMfInstance is available', async () => {
      mockShellInstance()
      const { getContext } = renderAndCaptureContext()
      const result = await firstValueFrom(getContext().getComponentsForSlot('unknown-slot'))
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(0)
    })

    it('should map matching slot components to SlotComponentConfiguration', async () => {
      const registerRemotes = jest.fn()
      mockShellInstance({ registerRemotes })
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'my-slot', components: ['comp-a'] }],
        components: [
          {
            name: 'comp-a',
            appId: 'app-a',
            productName: 'prod-a',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'REACT',
            baseUrl: 'http://localhost',
            exposedModule: './CompA',
            elementName: 'comp-a-element',
          },
        ],
      })

      const result = (await firstValueFrom(getContext().getComponentsForSlot('my-slot'))) as any[]
      expect(result).toHaveLength(1)
      expect(result[0].remoteComponent.appId).toBe('app-a')
      expect(result[0].remoteComponent.productName).toBe('prod-a')
    })

    it('should call registerRemotes when mapping components', async () => {
      const registerRemotes = jest.fn()
      mockShellInstance({ registerRemotes })
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'my-slot', components: ['comp-b'] }],
        components: [
          {
            name: 'comp-b',
            appId: 'app-b',
            productName: 'prod-b',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'REACT',
            baseUrl: 'http://localhost',
            exposedModule: './CompB',
            elementName: 'comp-b-element',
          },
        ],
      })

      await firstValueFrom(getContext().getComponentsForSlot('my-slot'))
      expect(registerRemotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'app-b' })]),
        { force: true }
      )
    })

    it('should throw when a component uses Angular technology', async () => {
      mockShellInstance()
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'ng-slot', components: ['ng-comp'] }],
        components: [
          {
            name: 'ng-comp',
            appId: 'ng-app',
            productName: 'ng-prod',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'ANGULAR',
            baseUrl: 'http://localhost',
            exposedModule: './NgComp',
          },
        ],
      })

      await expect(firstValueFrom(getContext().getComponentsForSlot('ng-slot'))).rejects.toThrow(
        'cannot be loaded in React'
      )
    })

    it('should register remote as module type when technology is WebComponentModule', async () => {
      const registerRemotes = jest.fn()
      mockShellInstance({ registerRemotes })
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'wc-slot', components: ['wc-comp'] }],
        components: [
          {
            name: 'wc-comp',
            appId: 'wc-app',
            productName: 'wc-prod',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'WEB_COMPONENT_MODULE',
            baseUrl: 'http://localhost',
            exposedModule: './WcComp',
          },
        ],
      })

      await firstValueFrom(getContext().getComponentsForSlot('wc-slot'))
      expect(registerRemotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ type: 'module' })]),
        { force: true }
      )
    })

    it('should register remote as script type when technology is React', async () => {
      const registerRemotes = jest.fn()
      mockShellInstance({ registerRemotes })
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'react-slot', components: ['react-comp'] }],
        components: [
          {
            name: 'react-comp',
            appId: 'react-app',
            productName: 'react-prod',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'REACT',
            baseUrl: 'http://localhost',
            exposedModule: './ReactComp',
          },
        ],
      })

      await firstValueFrom(getContext().getComponentsForSlot('react-slot'))
      expect(registerRemotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ type: 'script' })]),
        { force: true }
      )
    })

    it('should skip components not listed in slot', async () => {
      mockShellInstance({ registerRemotes: jest.fn() })
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'partial-slot', components: ['comp-x'] }],
        components: [
          {
            name: 'comp-x',
            appId: 'app-x',
            productName: 'prod-x',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'REACT',
            baseUrl: 'http://localhost',
            exposedModule: './CompX',
          },
          {
            name: 'comp-y',
            appId: 'app-y',
            productName: 'prod-y',
            remoteEntryUrl: 'http://localhost/remoteEntry.js',
            technology: 'REACT',
            baseUrl: 'http://localhost',
            exposedModule: './CompY',
          },
        ],
      })

      const result = (await firstValueFrom(getContext().getComponentsForSlot('partial-slot'))) as any[]
      expect(result).toHaveLength(1)
      expect(result[0].remoteComponent.appId).toBe('app-x')
    })
  })

  describe('isSomeComponentDefinedForSlot', () => {
    it('should return false when no slots match', async () => {
      mockShellInstance()
      const { getContext } = renderAndCaptureContext()
      const result = await firstValueFrom(getContext().isSomeComponentDefinedForSlot('no-such-slot'))
      expect(result).toBe(false)
    })

    it('should return false when slot exists but has no components', async () => {
      mockShellInstance()
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'empty-slot', components: [] }],
        components: [],
      })

      const result = await firstValueFrom(getContext().isSomeComponentDefinedForSlot('empty-slot'))
      expect(result).toBe(false)
    })

    it('should return true when slot has components', async () => {
      mockShellInstance()
      const { getContext } = renderAndCaptureContext()

      getRemoteComponentsSubject().next({
        slots: [{ name: 'filled-slot', components: ['c1'] }],
        components: [],
      })

      const result = await firstValueFrom(getContext().isSomeComponentDefinedForSlot('filled-slot'))
      expect(result).toBe(true)
    })
  })

  describe('loadComponent', () => {
    it('should load a remote component module', async () => {
      const mockModule = { default: () => null }
      const mockLoadRemote = jest.fn().mockResolvedValue(mockModule)
      mockShellInstance({ loadRemote: mockLoadRemote })
      const { getContext } = renderAndCaptureContext()

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: './TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await getContext().loadComponent(component)
      expect(result).toBe(mockModule)
      expect(mockLoadRemote).toHaveBeenCalledWith('test-app/TestComponent')
    })

    it('should strip ./ prefix from exposedModule', async () => {
      const mockModule = { default: () => null }
      const mockLoadRemote = jest.fn().mockResolvedValue(mockModule)
      mockShellInstance({ loadRemote: mockLoadRemote })
      const { getContext } = renderAndCaptureContext()

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: 'TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await getContext().loadComponent(component)
      expect(result).toBe(mockModule)
      expect(mockLoadRemote).toHaveBeenCalledWith('test-app/TestComponent')
    })

    it('should return undefined when loadRemote fails', async () => {
      const mockLoadRemote = jest.fn().mockRejectedValue(new Error('Load failed'))
      mockShellInstance({ loadRemote: mockLoadRemote })
      const { getContext } = renderAndCaptureContext()

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: './TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await getContext().loadComponent(component)
      expect(result).toBeUndefined()
    })
  })
})
