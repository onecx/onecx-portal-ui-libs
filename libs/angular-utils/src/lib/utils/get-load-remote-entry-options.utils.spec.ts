import { toLoadRemoteEntryOptions, createRemoteConfig, Technologies } from './get-load-remote-entry-options.utils'
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
})
