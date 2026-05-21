import {
  toLoadRemoteEntryOptions,
  createRemoteConfig,
  Technologies,
  registerAndLoadRemote,
  getShellMfInstance,
} from './get-load-remote-entry-options.utils'
import { RemoteComponent, Technologies as IntegrationTechnologies } from '@onecx/integration-interface'

describe('get-load-remote-entry-options', () => {
  describe('createRemoteConfig', () => {
    it('should create Remote config with all parameters', () => {
      const result = createRemoteConfig(
        'http://example.com/remoteEntry.js',
        'my-remote',
        'module',
        'custom'
      )

      expect(result).toEqual({
        type: 'module',
        entry: 'http://example.com/remoteEntry.js',
        name: 'my-remote',
        shareScope: 'custom',
      })
    })

    it('should use default type (module) when not provided', () => {
      const result = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')

      expect(result.type).toBe('module')
    })

    it('should use default shareScope (default) when not provided', () => {
      const result = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')

      expect(result.shareScope).toBe('default')
    })

    it('should support script type', () => {
      const result = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote', 'script')

      expect(result.type).toBe('script')
    })

    it('should support custom shareScope with default type', () => {
      const result = createRemoteConfig(
        'http://example.com/remoteEntry.js',
        'my-remote',
        'module',
        'customScope'
      )

      expect(result.shareScope).toBe('customScope')
    })
  })

  describe('toLoadRemoteEntryOptions', () => {
    it('should create Remote config from RemoteComponent with Angular technology', async () => {
      const remoteComponent: RemoteComponent = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        technology: IntegrationTechnologies.Angular,
        baseUrl: 'http://example.com',
        exposedModule: './Module',
        name: 'component1',
        remoteName: 'product1|app1',
      }

      const result = await toLoadRemoteEntryOptions(remoteComponent)

      expect(result).toEqual({
        type: 'module',
        entry: 'http://example.com/remoteEntry.js',
        name: 'product1|app1',
        shareScope: 'default',
      })
    })

    it('should create Remote config with custom shareScope', async () => {
      const remoteComponent: RemoteComponent = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        technology: IntegrationTechnologies.Angular,
        baseUrl: 'http://example.com',
        exposedModule: './Module',
        name: 'component1',
        remoteName: 'product1|app1',
        shareScope: 'custom',
      }

      const result = await toLoadRemoteEntryOptions(remoteComponent)

      expect(result.shareScope).toBe('custom')
    })

    it('should use module type for WebComponentModule technology', async () => {
      const remoteComponent: RemoteComponent = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        technology: IntegrationTechnologies.WebComponentModule,
        baseUrl: 'http://example.com',
        exposedModule: './Module',
        name: 'component1',
        remoteName: 'product1|app1',
      }

      const result = await toLoadRemoteEntryOptions(remoteComponent)

      expect(result.type).toBe('module')
    })

    it('should use script type for WebComponentScript technology', async () => {
      const remoteComponent: RemoteComponent = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        technology: IntegrationTechnologies.WebComponentScript,
        baseUrl: 'http://example.com',
        exposedModule: './Module',
        name: 'component1',
        remoteName: 'product1|app1',
      }

      const result = await toLoadRemoteEntryOptions(remoteComponent)

      expect(result.type).toBe('script')
    })
  })

  describe('with BffGeneratedRoute', () => {
    it('should create Remote config from BffGeneratedRoute', async () => {
      const route = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        technology: Technologies.Angular,
        baseUrl: 'http://example.com',
      }

      const result = await toLoadRemoteEntryOptions(route)

      expect(result).toEqual({
        type: 'module',
        entry: 'http://example.com/remoteEntry.js',
        name: 'product1|app1',
        shareScope: 'default',
      })
    })

    it('should handle missing technology field', async () => {
      const route = {
        appId: 'app1',
        productName: 'product1',
        remoteEntryUrl: 'http://example.com/remoteEntry.js',
        baseUrl: 'http://example.com',
      }

      const result = await toLoadRemoteEntryOptions(route)

      expect(result.type).toBe('script')
    })
  })

  describe('getShellMfInstance', () => {
    let originalGlobalThis: any
    let originalFederation: any

    beforeEach(() => {
      originalGlobalThis = (globalThis as any).onecxFederationInstance
      originalFederation = (globalThis as any).__FEDERATION__
    })

    afterEach(() => {
      if (originalGlobalThis !== undefined) {
        ;(globalThis as any).onecxFederationInstance = originalGlobalThis
      } else {
        delete (globalThis as any).onecxFederationInstance
      }
      if (originalFederation !== undefined) {
        ;(globalThis as any).__FEDERATION__ = originalFederation
      } else {
        delete (globalThis as any).__FEDERATION__
      }
    })

    it('should return the onecxFederationInstance when it exists', () => {
      const mockInstance = { registerRemotes: jest.fn(), loadRemote: jest.fn() }
      ;(globalThis as any).onecxFederationInstance = mockInstance

      const result = getShellMfInstance()

      expect(result).toBe(mockInstance)
    })

    it('should return the shell instance from __FEDERATION__ when onecxFederationInstance does not exist', () => {
      delete (globalThis as any).onecxFederationInstance
      const mockShellInstance = { name: 'onecx_shell_ui', registerRemotes: jest.fn(), loadRemote: jest.fn() }
      const mockOtherInstance = { name: 'other_app', registerRemotes: jest.fn(), loadRemote: jest.fn() }
      ;(globalThis as any).__FEDERATION__ = {
        __INSTANCES__: [mockOtherInstance, mockShellInstance]
      }

      const result = getShellMfInstance()

      expect(result).toBe(mockShellInstance)
    })

    it('should return undefined when neither onecxFederationInstance nor shell instance exist', () => {
      delete (globalThis as any).onecxFederationInstance
      ;(globalThis as any).__FEDERATION__ = {
        __INSTANCES__: []
      }

      const result = getShellMfInstance()

      expect(result).toBeUndefined()
    })
  })

  describe('registerAndLoadRemote', () => {
    let mockInstance: any

    beforeEach(() => {
      jest.clearAllMocks()
      mockInstance = {
        registerRemotes: jest.fn(),
        loadRemote: jest.fn(),
      }
    })

    it('should register remotes and load the exposed module using the provided instance', async () => {
      const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')
      const mockModule = { MyComponent: 'component' }
      mockInstance.loadRemote.mockResolvedValue(mockModule)

      const result = await registerAndLoadRemote(mockInstance, remoteConfig, 'MyComponent')

      expect(mockInstance.registerRemotes).toHaveBeenCalledWith([remoteConfig])
      expect(mockInstance.loadRemote).toHaveBeenCalledWith('my-remote/MyComponent')
      expect(result).toBe(mockModule)
    })

    it('should sanitize exposed module path by removing leading ./', async () => {
      const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'product1|app1')
      const mockModule = { default: jest.fn() }
      mockInstance.loadRemote.mockResolvedValue(mockModule)

      await registerAndLoadRemote(mockInstance, remoteConfig, './MyModule')

      expect(mockInstance.loadRemote).toHaveBeenCalledWith('product1|app1/MyModule')
    })

    it('should not modify path without leading ./', async () => {
      const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')
      const mockModule = { Component: 'test' }
      mockInstance.loadRemote.mockResolvedValue(mockModule)

      await registerAndLoadRemote(mockInstance, remoteConfig, 'Component')

      expect(mockInstance.loadRemote).toHaveBeenCalledWith('my-remote/Component')
    })
  })
})
