import { ImageResolver, OnecxServiceImage, OnecxShellImage } from '../../../index'

describe('ImageResolver', () => {
  describe('Default Images', () => {
    it('should return default images when no overrides provided', () => {
      const config = {
        core: { postgres: true, keycloak: true },
      }
      const resolver = new ImageResolver(config)

      expect(resolver.getPostgresImage()).toBe('docker.io/library/postgres:13.4')
      expect(resolver.getKeycloakImage()).toBe('quay.io/keycloak/keycloak:23.0.4')
      expect(resolver.getNodeImage()).toBe('docker.io/library/node:20')
    })

    it('should return default service images', () => {
      const config = {
        core: { postgres: true, keycloak: true },
      }
      const resolver = new ImageResolver(config)

      expect(resolver.getServiceImage(OnecxServiceImage.ONECX_WORKSPACE_SVC)).toBe(
        'ghcr.io/onecx/onecx-workspace-svc:main-native'
      )
      expect(resolver.getShellImage(OnecxShellImage.ONECX_SHELL_BFF)).toBe('ghcr.io/onecx/onecx-shell-bff:main-native')
    })
  })

  describe('Version Overrides', () => {
    it('should apply core version overrides', () => {
      const config = {
        core: { postgres: true, keycloak: true },
        imageVersions: {
          core: {
            postgres: 'postgres:15',
            keycloak: 'quay.io/keycloak/keycloak:24.0.0',
            node: 'node:18',
          },
        },
      }
      const resolver = new ImageResolver(config)

      expect(resolver.getPostgresImage()).toBe('postgres:15')
      expect(resolver.getKeycloakImage()).toBe('quay.io/keycloak/keycloak:24.0.0')
      expect(resolver.getNodeImage()).toBe('node:18')
    })

    it('should apply service version overrides', () => {
      const config = {
        core: { postgres: true, keycloak: true },
        imageVersions: {
          services: {
            workspace: 'rc-native',
            theme: 'v2.1.0-native',
          },
        },
      }
      const resolver = new ImageResolver(config)

      expect(resolver.getServiceImage(OnecxServiceImage.ONECX_WORKSPACE_SVC)).toBe(
        'ghcr.io/onecx/onecx-workspace-svc:rc-native'
      )
      expect(resolver.getServiceImage(OnecxServiceImage.ONECX_THEME_SVC)).toBe(
        'ghcr.io/onecx/onecx-theme-svc:v2.1.0-native'
      )
    })

    it('should apply shell version overrides', () => {
      const config = {
        core: { postgres: true, keycloak: true },
        imageVersions: {
          shell: {
            bff: 'rc-native',
            ui: 'v2.0.0',
          },
        },
      }
      const resolver = new ImageResolver(config)

      expect(resolver.getShellImage(OnecxShellImage.ONECX_SHELL_BFF)).toBe('ghcr.io/onecx/onecx-shell-bff:rc-native')
      expect(resolver.getShellImage(OnecxShellImage.ONECX_SHELL_UI)).toBe('ghcr.io/onecx/onecx-shell-ui:v2.0.0')
    })
  })

  describe('Partial Overrides', () => {
    it('should mix default and override versions', () => {
      const config = {
        core: { postgres: true, keycloak: true },
        imageVersions: {
          core: {
            postgres: 'postgres:14', // Only override postgres
          },
          services: {
            workspace: 'rc-native', // Only override workspace
          },
        },
      }
      const resolver = new ImageResolver(config)

      // Overridden
      expect(resolver.getPostgresImage()).toBe('postgres:14')
      expect(resolver.getServiceImage(OnecxServiceImage.ONECX_WORKSPACE_SVC)).toBe(
        'ghcr.io/onecx/onecx-workspace-svc:rc-native'
      )

      // Default
      expect(resolver.getKeycloakImage()).toBe('quay.io/keycloak/keycloak:23.0.4')
      expect(resolver.getServiceImage(OnecxServiceImage.ONECX_THEME_SVC)).toBe(
        'ghcr.io/onecx/onecx-theme-svc:main-native'
      )
    })
  })
})
