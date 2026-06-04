/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 *
 * @jest-environment node
 */

import * as fs from 'fs'
import { getOneCXSharedLibraryConfig, onecxPackageFilter, SharedLibraryConfigOptions } from './get-onecx-shared-library-config'

describe('get-onecx-shared-library-config', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('onecxPackageFilter', () => {
    it.each([
      ['@nx/angular'],
      ['@module-federation/enhanced'],
      ['primeng/editor'],
      ['@onecx/angular-accelerator/testing'],
    ])('should return true (EXCLUDE) for blacklisted package %s', (pkg) => {
      expect(onecxPackageFilter(pkg)).toBe(true)
    })

    it.each([
      ['@angular/core/testing'],
      ['@ngrx/store'],
    ])('should return false (INCLUDE) for allowed package %s', (pkg) => {
      expect(onecxPackageFilter(pkg)).toBe(false)
    })
  })

  describe('getOneCXSharedLibraryConfig', () => {
    it('should return an empty object when dependencies are empty', () => {
      expect(getOneCXSharedLibraryConfig({}, false)).toEqual({})
      expect(getOneCXSharedLibraryConfig({}, true)).toEqual({})
    })

    it('should exclude blacklisted scopes and packages not matching any OneCX recommendation', () => {
      const deps = {
        '@nx/angular': '^20.0.0',
        '@nx/angular/something': '^20.0.0',
        '@module-federation/enhanced': '^2.0.0',
        '@module-federation/runtime-core/utils': '^2.0.0',
        'some-random-lib': '^1.0.0',
        '@angular/core': '^21.0.0',
        'rxjs': '^7.8.0',
      }

      const result = getOneCXSharedLibraryConfig(deps, false)

      expect(result['@nx/angular']).toBeUndefined()
      expect(result['@nx/angular/something']).toBeUndefined()
      expect(result['@module-federation/enhanced']).toBeUndefined()
      expect(result['@module-federation/runtime-core/utils']).toBeUndefined()
      expect(result['some-random-lib']).toBeUndefined()
      expect(result['@angular/core']).toBeDefined()
      expect(result['rxjs']).toBeDefined()
    })

    it('should respect packageFilterCallback: true excludes, false force-includes, undefined defers to default', () => {
      const packageFilterCallback: SharedLibraryConfigOptions['packageFilterCallback'] = (pkg) => {
        if (pkg === 'rxjs') return true             // explicit EXCLUDE
        if (pkg === '@angular/core') return false   // explicit INCLUDE (default would also include it)
        return undefined                            // defer to default filter
      }
      const deps = { '@angular/core': '^21.0.0', 'rxjs': '^7.8.0', '@nx/angular': '^20.0.0' }

      const result = getOneCXSharedLibraryConfig(deps, false, { packageFilterCallback })

      expect(result['rxjs']).toBeUndefined()
      expect(result['@angular/core']).toBeDefined()
      expect(result['@nx/angular']).toBeUndefined()
    })

    it.each([
      ['@angular/core'],
      ['@onecx/accelerator'],
      ['rxjs'],
      ['primeng'],
      ['@ngx-translate/core'],
      ['@ngrx/store'],
    ])('should set singleton/strictVersion/eager to false and preserve requiredVersion for %s', (pkg) => {
      const result = getOneCXSharedLibraryConfig({ [pkg]: '^1.0.0' }, false)

      expect(result[pkg]).toBeDefined()
      expect(result[pkg].singleton).toBe(false)
      expect(result[pkg].strictVersion).toBe(false)
      expect(result[pkg].eager).toBe(false)
      expect(result[pkg].requiredVersion).toBe('^1.0.0')
    })

    it.each([
      ['^21.0.0', 'angular_21'],
      ['22.0.0', 'angular_22'],
    ])('should derive shareScope from @angular/core version %s → %s', (version, expectedScope) => {
      const result = getOneCXSharedLibraryConfig({ '@angular/core': version }, false)
      expect(result['@angular/core'].shareScope).toBe(expectedScope)
    })

    it('should set shareScope to default when @angular/core is below v21, absent, or has empty version', () => {
      const below21 = getOneCXSharedLibraryConfig({ '@angular/core': '^20.0.0' }, false)
      const absent  = getOneCXSharedLibraryConfig({ 'rxjs': '^7.8.0' }, false)
      const empty   = getOneCXSharedLibraryConfig({ '@angular/core': '' }, false)

      expect(below21['@angular/core'].shareScope).toBe('default')
      expect(absent['rxjs'].shareScope).toBe('default')
      expect(empty['@angular/core'].shareScope).toBe('default')
    })

    it('should apply the same shareScope to every package in the result', () => {
      const result = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0', 'rxjs': '^7.8.0', '@ngrx/store': '^17.0.0' },
        false,
      )
      Object.values(result).forEach((config) => expect(config.shareScope).toBe('angular_21'))
    })


    it('should not generate subpackages when shouldGenerateSubDeps is false', () => {
      const result = getOneCXSharedLibraryConfig({ '@angular/core': '^21.0.0' }, false)

      expect(result['@angular/core']).toBeDefined()
      expect(Object.keys(result).filter((k) => k.startsWith('@angular/core/'))).toHaveLength(0)
    })

    it('should generate subpackages from package exports, skipping EXPORTS_BLACKLIST and DEFAULT_FULL_PACKAGE_BLACKLIST entries', () => {
      const result = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0', '@angular/router': '^21.0.0' },
        true,
      )

      expect(result['@angular/core']).toBeDefined()
      expect(result['@angular/router']).toBeDefined()
      expect(Object.keys(result).filter((k) => k.startsWith('@angular/core/')).length).toBeGreaterThan(0)
      expect(result['@angular/core/']).toBeUndefined()
      expect(result['@angular/core/package.json']).toBeUndefined()
      expect(result['@angular/core/event-dispatch-contract.min.js']).toBeUndefined()
      expect(result['@angular/router/upgrade']).toBeUndefined()
    })

    it('should apply packageFilterCallback to subpackages: explicit true excludes, explicit false force-includes blacklisted entries', () => {
      const withExclusion = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0' },
        true,
        { packageFilterCallback: (pkg) => (pkg.includes('/testing') ? true : undefined) },
      )
      const withInclusion = getOneCXSharedLibraryConfig(
        { '@angular/router': '^21.0.0' },
        true,
        { packageFilterCallback: (pkg) => (pkg === '@angular/router/upgrade' ? false : undefined) },
      )

      expect(Object.keys(withExclusion).filter((k) => k.includes('/testing'))).toHaveLength(0)
      expect(withExclusion['@angular/core']).toBeDefined()
      expect(withInclusion['@angular/router/upgrade']).toBeDefined()
    })

    it('should not throw and return no subpackages for an unresolvable package', () => {
      const result = getOneCXSharedLibraryConfig({ '@angular/nonexistent-fake-pkg': '^21.0.0' }, true)
      expect(result).toBeDefined()
    })

    it('should not generate subpackages when the package.json file does not exist on disk', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      const result = getOneCXSharedLibraryConfig({ '@angular/core': '^21.0.0' }, true)

      expect(result['@angular/core']).toBeDefined()
      expect(Object.keys(result).filter((k) => k.startsWith('@angular/core/'))).toHaveLength(0)
    })


    it('should invoke configCallback with the package name and pre-computed config, and apply the returned config', () => {
      const received: Array<{ name: string; config: Record<string, unknown> }> = []
      const configCallback: SharedLibraryConfigOptions['configCallback'] = (pkgName, config) => {
        received.push({ name: pkgName, config: { ...config } as Record<string, unknown> })
        return { ...config, shareScope: 'customScope' }
      }

      const result = getOneCXSharedLibraryConfig({ '@angular/core': '^21.0.0' }, false, { configCallback })

      expect(received[0].name).toBe('@angular/core')
      expect(received[0].config['shareScope']).toBe('angular_21')
      expect(received[0].config['requiredVersion']).toBe('^21.0.0')
      expect(result['@angular/core'].shareScope).toBe('customScope')
    })

    it('should ignore configCallback result when it returns a non-object (undefined or primitive)', () => {
      const withUndefined = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0' },
        false,
        { configCallback: () => undefined as any },
      )
      const withPrimitive = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0' },
        false,
        { configCallback: () => 'invalid' as any },
      )

      expect(withUndefined['@angular/core'].shareScope).toBe('angular_21')
      expect(withUndefined['@angular/core'].requiredVersion).toBe('^21.0.0')
      expect(withPrimitive['@angular/core'].shareScope).toBe('angular_21')
    })

    it('should apply configCallback to all entries including subpackages, and only to packages that pass packageFilterCallback', () => {
      const withSubs = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0' },
        true,
        { configCallback: (_, config) => ({ ...config, shareScope: 'subScope' }) },
      )
      const withFilter = getOneCXSharedLibraryConfig(
        { '@angular/core': '^21.0.0', 'rxjs': '^7.8.0' },
        false,
        {
          configCallback: (_, config) => ({ ...config, shareScope: 'myScope' }),
          packageFilterCallback: (pkg) => (pkg === 'rxjs' ? true : undefined),
        },
      )

      Object.values(withSubs).forEach((config) => expect(config.shareScope).toBe('subScope'))
      expect(withFilter['@angular/core'].shareScope).toBe('myScope')
      expect(withFilter['rxjs']).toBeUndefined()
    })
  })


  describe('integration', () => {
    it('should generate correct shared config for a typical Angular 21 project', () => {
      const deps = {
        '@angular/core': '^21.0.0',
        '@angular/common': '^21.0.0',
        'rxjs': '^7.8.0',
        '@ngrx/store': '^21.0.0',
        '@ngx-translate/core': '^17.0.0',
        'primeng': '^21.0.0',
        '@nx/angular': '^20.0.0',
        '@module-federation/enhanced': '^2.0.0',
        'some-build-tool': '^1.0.0',
      }

      const result = getOneCXSharedLibraryConfig(deps, false)

      expect(result['@angular/core']).toBeDefined()
      expect(result['@angular/common']).toBeDefined()
      expect(result['rxjs']).toBeDefined()
      expect(result['@ngrx/store']).toBeDefined()
      expect(result['@ngx-translate/core']).toBeDefined()
      expect(result['primeng']).toBeDefined()
      expect(result['@nx/angular']).toBeUndefined()
      expect(result['@module-federation/enhanced']).toBeUndefined()
      expect(result['some-build-tool']).toBeUndefined()
      Object.values(result).forEach((cfg) => {
        expect(cfg.singleton).toBe(false)
        expect(cfg.strictVersion).toBe(false)
        expect(cfg.eager).toBe(false)
        expect(cfg.shareScope).toBe('angular_21')
      })
    })
  })
})


