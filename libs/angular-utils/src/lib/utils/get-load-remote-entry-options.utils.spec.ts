import {
  toLoadRemoteEntryOptions,
  createRemoteConfig,
  Technologies,
  registerAndLoadRemote,
  getFederationInstance,
} from './get-load-remote-entry-options.utils'
import { RemoteComponent, Technologies as IntegrationTechnologies } from '@onecx/integration-interface'
import { registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'

jest.mock('@module-federation/enhanced/runtime', () => ({
  registerRemotes: jest.fn(),
  loadRemote: jest.fn(),
}))

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

  describe('getFederationInstance', () => {
    let originalGlobalThis: any

    beforeEach(() => {
      originalGlobalThis = (globalThis as any).onecxFederationInstance
    })

    afterEach(() => {
      if (originalGlobalThis !== undefined) {
        ;(globalThis as any).onecxFederationInstance = originalGlobalThis
      } else {
        delete (globalThis as any).onecxFederationInstance
      }
    })

    it('should return the federation instance when it exists', () => {
      const mockInstance = { registerRemotes: jest.fn(), loadRemote: jest.fn() }
      ;(globalThis as any).onecxFederationInstance = mockInstance

      const result = getFederationInstance()

      expect(result).toBe(mockInstance)
    })

    it('should return undefined when federation instance does not exist', () => {
      delete (globalThis as any).onecxFederationInstance

      const result = getFederationInstance()

      expect(result).toBeUndefined()
    })
  })

  describe('registerAndLoadRemote', () => {
    const mockRegisterRemotes = registerRemotes as jest.Mock
    const mockLoadRemote = loadRemote as jest.Mock
    let originalGlobalThis: any

    beforeEach(() => {
      jest.clearAllMocks()
      originalGlobalThis = (globalThis as any).onecxFederationInstance
      delete (globalThis as any).onecxFederationInstance
    })

    afterEach(() => {
      if (originalGlobalThis !== undefined) {
        ;(globalThis as any).onecxFederationInstance = originalGlobalThis
      } else {
        delete (globalThis as any).onecxFederationInstance
      }
    })

    describe('without federation instance', () => {
      it('should register remotes and load the exposed module using runtime functions', async () => {
        const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')
        const mockModule = { MyComponent: 'component' }
        mockLoadRemote.mockResolvedValue(mockModule)

        const result = await registerAndLoadRemote(remoteConfig, 'MyComponent')

        expect(mockRegisterRemotes).toHaveBeenCalledWith([remoteConfig])
        expect(mockLoadRemote).toHaveBeenCalledWith('my-remote/MyComponent')
        expect(result).toBe(mockModule)
      })

      it('should sanitize exposed module path by removing leading ./', async () => {
        const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'product1|app1')
        const mockModule = { default: jest.fn() }
        mockLoadRemote.mockResolvedValue(mockModule)

        await registerAndLoadRemote(remoteConfig, './MyModule')

        expect(mockLoadRemote).toHaveBeenCalledWith('product1|app1/MyModule')
      })

      it('should not modify path without leading ./', async () => {
        const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')
        const mockModule = { Component: 'test' }
        mockLoadRemote.mockResolvedValue(mockModule)

        await registerAndLoadRemote(remoteConfig, 'Component')

        expect(mockLoadRemote).toHaveBeenCalledWith('my-remote/Component')
      })
    })

    describe('with federation instance', () => {
      let mockInstance: any

      beforeEach(() => {
        mockInstance = {
          registerRemotes: jest.fn(),
          loadRemote: jest.fn(),
        }
        ;(globalThis as any).onecxFederationInstance = mockInstance
      })

      it('should use federation instance to register and load module', async () => {
        const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'my-remote')
        const mockModule = { MyComponent: 'component' }
        mockInstance.loadRemote.mockResolvedValue(mockModule)

        const result = await registerAndLoadRemote(remoteConfig, 'MyComponent')

        expect(mockInstance.registerRemotes).toHaveBeenCalledWith([remoteConfig])
        expect(mockInstance.loadRemote).toHaveBeenCalledWith('my-remote/MyComponent')
        expect(mockRegisterRemotes).not.toHaveBeenCalled()
        expect(mockLoadRemote).not.toHaveBeenCalled()
        expect(result).toBe(mockModule)
      })

      it('should sanitize module path when using federation instance', async () => {
        const remoteConfig = createRemoteConfig('http://example.com/remoteEntry.js', 'product1|app1')
        const mockModule = { default: jest.fn() }
        mockInstance.loadRemote.mockResolvedValue(mockModule)

        await registerAndLoadRemote(remoteConfig, './MyModule')

        expect(mockInstance.loadRemote).toHaveBeenCalledWith('product1|app1/MyModule')
      })
    })
  })
})
