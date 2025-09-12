import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { commonMigrateOnecxToV6 } from './common-migrate-onecx-to-v6.utils'

// Mock external modules
jest.mock('child_process')
jest.mock('../utils/import-statements.utils')
jest.mock('../angular/replacement-in-files.utils')
jest.mock('../migrations/v6/replace-pia-imports')
jest.mock('../migrations/v6/replace-portal-core-module')
jest.mock('../migrations/v6/remove-pia-imports')
jest.mock('../angular/html-templates.utils')

import { execSync } from 'child_process'
import { replaceImportValuesAndModule } from '../utils/import-statements.utils'
import { replaceInFiles } from '../angular/replacement-in-files.utils'
import { replaceTagInAngularTemplates } from '../angular/html-templates.utils'
import replacePortalCoreModule from '../migrations/v6/replace-portal-core-module'
import replacePortalIntegrationAngularImports from '../migrations/v6/replace-pia-imports'
import removePortalIntegrationAngularImports from '../migrations/v6/remove-pia-imports'

describe('commonMigrateOnecxToV6', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    jest.clearAllMocks()

    // Mock execSync to avoid actual npm commands
    ;(execSync as jest.Mock).mockImplementation(() => {})
  })

  describe('main migration', () => {
    beforeEach(() => {
      // Setup basic package.json
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@angular/core': '^18.0.0',
            '@onecx/standalone-shell': '^5.0.0',
            primeng: '^18.0.0',
          },
          devDependencies: {
            '@nx/angular': '^19.0.0',
          },
        })
      )

      // Setup project.json
      tree.write(
        'project.json',
        JSON.stringify({
          targets: {
            build: {
              options: {
                styles: ['src/styles.scss', 'node_modules/primeng/resources/primeng.min.css'],
              },
            },
          },
        })
      )
    })

    it('should update package.json dependencies', async () => {
      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')

      // Check Angular dependencies updated to v19
      expect(packageJson.dependencies['@angular/core']).toBe('^19.0.7')

      // Check standalone shell replacement
      expect(packageJson.dependencies['@onecx/standalone-shell']).toBeUndefined()
      expect(packageJson.dependencies['@onecx/angular-standalone-shell']).toBe('^6.0.0')

      // Check dev dependencies
      expect(packageJson.devDependencies['@nx/angular']).toBe('~20.3.4')
    })

    it('should remove PrimeNG CSS from project.json', async () => {
      await commonMigrateOnecxToV6(tree)

      const projectJson = JSON.parse(tree.read('project.json', 'utf-8') || '{}')
      expect(projectJson.targets.build.options.styles).not.toContain('node_modules/primeng/resources/primeng.min.css')
      expect(projectJson.targets.build.options.styles).toContain('src/styles.scss')
    })

    it('should execute npm run apigen', async () => {
      await commonMigrateOnecxToV6(tree)

      expect(execSync).toHaveBeenCalledWith('npm run apigen', {
        cwd: tree.root,
        stdio: 'inherit',
      })
    })

    it('should migrate PrimeNG imports', async () => {
      await commonMigrateOnecxToV6(tree)

      expect(replaceImportValuesAndModule).toHaveBeenCalledWith(tree, 'src', [
        {
          oldModuleSpecifier: 'primeng/api',
          newModuleSpecifier: 'primeng/config',
          valueReplacements: [{ oldValue: 'PrimeNGConfig', newValue: 'PrimeNG' }],
        },
      ])

      expect(replaceInFiles).toHaveBeenCalledWith(tree, 'src', 'Identifier[name="PrimeNGConfig"]', 'PrimeNG')
    })

    it('should migrate FilterType.TRUTHY', async () => {
      await commonMigrateOnecxToV6(tree)

      const queryFiltertypeTruthy =
        'PropertyAccessExpression:has(Identifier[name="FilterType"]) Identifier[name="TRUTHY"]'
      expect(replaceInFiles).toHaveBeenCalledWith(tree, 'src', queryFiltertypeTruthy, 'IS_NOT_EMPTY')
    })
  })

  describe('error handling', () => {
    it('should handle missing build target in project.json', async () => {
      // Create a project.json with incomplete structure (missing build target)
      tree.write('package.json', JSON.stringify({ dependencies: {} }))
      tree.write(
        'project.json',
        JSON.stringify({
          targets: {
            // No build target here - this will cause the error
          },
        })
      )

      // The function will throw an error because it cannot access build.options
      await expect(commonMigrateOnecxToV6(tree)).rejects.toThrow()
    })

    it('should handle missing styles in project.json build options', async () => {
      // Create a project.json with build target but no styles
      tree.write('package.json', JSON.stringify({ dependencies: {} }))
      tree.write(
        'project.json',
        JSON.stringify({
          targets: {
            build: {
              options: {
                // No styles array here
              },
            },
          },
        })
      )

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await commonMigrateOnecxToV6(tree)

      expect(consoleSpy).toHaveBeenCalledWith('Cannot find styles array in project.json or project.json itself')

      consoleSpy.mockRestore()
    })

    it('should handle missing webpack.config.js gracefully', async () => {
      // Setup basic files but no webpack.config.js
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@onecx/keycloak-auth': '^5.0.0',
          },
        })
      )
      // Add project.json to avoid other errors
      tree.write(
        'project.json',
        JSON.stringify({
          targets: { build: { options: { styles: [] } } },
        })
      )

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await commonMigrateOnecxToV6(tree)

      expect(consoleSpy).toHaveBeenCalledWith('Cannot find webpack.config.js')

      consoleSpy.mockRestore()
    })
  })

  describe('package.json migrations', () => {
    beforeEach(() => {
      // Add required project.json for all package.json tests
      tree.write(
        'project.json',
        JSON.stringify({
          targets: { build: { options: { styles: [] } } },
        })
      )
    })

    it('should update all Angular dependencies to v19', async () => {
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@angular/core': '^18.0.0',
            '@angular/common': '^18.0.0',
            '@angular/forms': '^18.0.0',
            '@angular/router': '^18.0.0',
          },
        })
      )

      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')
      expect(packageJson.dependencies['@angular/core']).toBe('^19.0.7')
      expect(packageJson.dependencies['@angular/common']).toBe('^19.0.7')
      expect(packageJson.dependencies['@angular/forms']).toBe('^19.0.7')
      expect(packageJson.dependencies['@angular/router']).toBe('^19.0.7')
    })

    it('should update all OneCX dependencies to v6', async () => {
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@onecx/angular-auth': '^5.0.0',
            '@onecx/angular-accelerator': '^5.0.0',
          },
        })
      )

      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')
      expect(packageJson.dependencies['@onecx/angular-auth']).toBe('^6.0.0')
      expect(packageJson.dependencies['@onecx/angular-accelerator']).toBe('^6.0.0')
    })

    it('should update all NgRx dependencies to v19', async () => {
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@ngrx/store': '^18.0.0',
            '@ngrx/effects': '^18.0.0',
            '@ngrx/router-store': '^18.0.0',
          },
        })
      )

      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')
      expect(packageJson.dependencies['@ngrx/store']).toBe('^19.0.1')
      expect(packageJson.dependencies['@ngrx/effects']).toBe('^19.0.1')
      expect(packageJson.dependencies['@ngrx/router-store']).toBe('^19.0.1')
    })

    it('should remove deprecated dependencies', async () => {
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@onecx/keycloak-auth': '^5.0.0',
            '@onecx/portal-layout-styles': '^5.0.0',
            'fast-deep-equal': '^3.0.0',
          },
          devDependencies: {
            'eslint-plugin-deprecation': '^2.0.0',
          },
        })
      )

      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')
      expect(packageJson.dependencies['@onecx/keycloak-auth']).toBeUndefined()
      expect(packageJson.dependencies['@onecx/portal-layout-styles']).toBeUndefined()
      expect(packageJson.dependencies['fast-deep-equal']).toBeUndefined()
      expect(packageJson.devDependencies['eslint-plugin-deprecation']).toBeUndefined()
    })
  })

  describe('PrimeNG Calendar migration', () => {
    beforeEach(() => {
      tree.write(
        'project.json',
        JSON.stringify({
          targets: { build: { options: { styles: [] } } },
        })
      )
    })

    it('should migrate Calendar to DatePicker imports', async () => {
      await commonMigrateOnecxToV6(tree)

      expect(replaceImportValuesAndModule).toHaveBeenCalledWith(tree, 'src', [
        {
          oldModuleSpecifier: 'primeng/calendar',
          newModuleSpecifier: 'primeng/datepicker',
          valueReplacements: [
            { oldValue: 'Calendar', newValue: 'DatePicker' },
            { oldValue: 'CalendarModule', newValue: 'DatePickerModule' },
          ],
        },
      ])
    })

    it('should replace Calendar components in TypeScript files', async () => {
      await commonMigrateOnecxToV6(tree)

      const calendarQuery =
        'PropertyDeclaration > Decorator > CallExpression:has(Identifier[name="ViewChildren"]) Identifier[name="Calendar"], TypeReference > Identifier[name="Calendar"]'
      expect(replaceInFiles).toHaveBeenCalledWith(tree, 'src', calendarQuery, 'DatePicker')
    })

    it('should replace p-calendar tags in templates', async () => {
      await commonMigrateOnecxToV6(tree)

      expect(replaceTagInAngularTemplates).toHaveBeenCalledWith(tree, 'src', 'p-calendar', 'p-datepicker')
    })
  })

  describe('webpack.config.js migration', () => {
    beforeEach(() => {
      // Add required project.json for webpack tests
      tree.write(
        'project.json',
        JSON.stringify({
          targets: { build: { options: { styles: [] } } },
        })
      )
      tree.write('package.json', JSON.stringify({ dependencies: {} }))
    })

    it('should remove keycloak-auth from webpack config', async () => {
      tree.write(
        'webpack.config.js',
        `
        module.exports = {
          plugins: [
            new ModuleFederationPlugin({
              shared: {
                '@onecx/keycloak-auth': { requiredVersion: 'auto', includeSecondaries: true },
                '@angular/core': { singleton: true }
              }
            })
          ]
        }
      `
      )

      await commonMigrateOnecxToV6(tree)

      const webpackContent = tree.read('webpack.config.js', 'utf-8')
      expect(webpackContent).not.toContain('@onecx/keycloak-auth')
      expect(webpackContent).toContain('@angular/core')
    })

    it('should replace standalone-shell with angular-standalone-shell in webpack', async () => {
      tree.write(
        'webpack.config.js',
        `
        shared: {
          '@onecx/standalone-shell': { requiredVersion: 'auto' }
        }
      `
      )

      await commonMigrateOnecxToV6(tree)

      const webpackContent = tree.read('webpack.config.js', 'utf-8')
      expect(webpackContent).not.toContain('@onecx/standalone-shell')
      expect(webpackContent).toContain('@onecx/angular-standalone-shell')
    })
  })

  describe('specific dependency updates', () => {
    beforeEach(() => {
      // Add required project.json for specific dependency tests
      tree.write(
        'project.json',
        JSON.stringify({
          targets: { build: { options: { styles: [] } } },
        })
      )
    })

    it('should update specific libraries to exact versions', async () => {
      tree.write(
        'package.json',
        JSON.stringify({
          dependencies: {
            '@angular/cdk': '^18.0.0',
            primeng: '^18.0.0',
            rxjs: '^7.0.0',
            zod: '^3.0.0',
          },
          devDependencies: {
            '@angular/cli': '^18.0.0',
            nx: '^19.0.0',
            typescript: '^5.0.0',
          },
        })
      )

      await commonMigrateOnecxToV6(tree)

      const packageJson = JSON.parse(tree.read('package.json', 'utf-8') || '{}')

      // Check specific version updates
      expect(packageJson.dependencies['@angular/cdk']).toBe('^19.0.5')
      expect(packageJson.dependencies['primeng']).toBe('^19.1.0')
      expect(packageJson.dependencies['rxjs']).toBe('~7.8.2')
      expect(packageJson.dependencies['zod']).toBe('^3.24.2')

      expect(packageJson.devDependencies['@angular/cli']).toBe('~19.0.0')
      expect(packageJson.devDependencies['nx']).toBe('~20.3.4')
    })
  })
})
