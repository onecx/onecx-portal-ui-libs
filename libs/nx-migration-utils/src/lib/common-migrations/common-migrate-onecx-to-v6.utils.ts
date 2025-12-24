import {
  addDependenciesToPackageJson,
  formatFiles,
  readJson,
  removeDependenciesFromPackageJson,
  Tree,
  updateJson,
  visitNotIgnoredFiles,
  writeJson,
} from '@nx/devkit'
import { execSync } from 'child_process'
import { detectMethodCallsInFiles } from '../utils/detect-method-calls-in-files.utils'

import { replaceTagInAngularTemplates } from '../angular/html-templates.utils'
import { removeParameters } from '../angular/parameters.utils'
import { replaceInFiles } from '../angular/replacement-in-files.utils'
import {
  removeImportsByModuleSpecifier,
  removeImportValuesFromModule,
  replaceImportModuleSpecifier,
  replaceImportValues,
  replaceImportValuesAndModule,
} from '../utils/import-statements.utils'
import { printWarnings } from '../utils/print-warnings.utils'
import { addGitignoreEntry, removeGitignoreEntry } from '../utils/update-gitignore.utils'
import { Module, Provider } from '../angular'
import { detectVariablesWithModule } from '../angular/utils/detection/detect-variables-with-module.utils'
import { detectModulesImportingModule } from '../angular/utils/detection/detect-modules-importing-module.utils'
import { detectVariablesWithProvider } from '../angular/utils/detection/detect-variables-with-provider.utils'
import { addProviderInModuleIfDoesNotExist } from '../angular/utils/modification/add-provider-in-module-if-does-not-exist.utils'
import { addProviderImportIfDoesNotExist } from '../angular/utils/modification/add-provider-import-if-does-not-exist.utils'
import { hasHtmlTag } from '../utils/validation/has-html-tag.utils'
import { updateJsonFiles } from '../utils/modification/update-json-files.utils'
import { removeReferences } from '../utils/modification/remove-json-references.utils'
import { updateStyleSheets } from '../utils/modification/update-style-sheets.utils'
import replacePortalIntegrationAngularImports from '../migrations/v6/replace-pia-imports'
import replacePortalCoreModule from '../migrations/v6/replace-portal-core-module'
import removePortalIntegrationAngularImports from '../migrations/v6/remove-pia-imports'

const PORTAL_LAYOUT_STYLES = '@onecx/portal-layout-styles'

export async function commonMigrateOnecxToV6(tree: Tree) {
  const rootPath = tree.root
  const srcDirectoryPath = 'src'
  removeDependenciesFromPackageJson(tree, ['@nx/angular', '@nx/devkit', '@nx/plugin'], ['eslint-plugin-deprecation'])
  addDependenciesToPackageJson(
    tree,
    { '@primeng/themes': '^19.0.6' },
    { '@nx/angular': '~20.3.4', '@nx/devkit': '~20.3.4', '@nx/plugin': '~20.3.4' }
  )
  replaceStandaloneShellInPackage(tree)

  updateJson(tree, `package.json`, (json) => {
    const angularDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@angular/'))
    const onecxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@onecx/'))
    const ngrxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@ngrx/'))
    const angularDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@angular/'))
    const nxDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@nx/'))

    const dependenciesToUpdate: Record<string, string> = {
      '@angular/cdk': '^19.0.5',
      '@onecx/nx-plugin': '^1.10.0',
      '@ngx-translate/core': '^16.0.4',
      'keycloak-angular': '^19.0.2',
      'ngrx-store-localstorage': '^19.0.0',
      primeng: '^19.1.0',
      rxjs: '~7.8.2',
      zod: '^3.24.2',
      'zone.js': '~0.15.0',
    }

    const devDependenciesToUpdate: Record<string, string> = {
      '@angular-devkit/core': '^19.0.0',
      '@angular-devkit/schematics': '^19.0.0',
      '@angular/cli': '~19.0.0',
      '@angular-eslint/eslint-plugin': '^19.2.0',
      '@angular-eslint/eslint-plugin-template': '^19.2.0',
      '@angular-eslint/template-parser': '^19.2.0',
      '@angular/compiler-cli': '^19.0.0',
      '@angular/language-service': '^19.0.0',
      '@eslint/js': '^9.9.1',
      '@openapitools/openapi-generator-cli': '^2.16.3',
      '@schematics/angular': '~19.0.0',
      '@swc-node/register': '~1.10.9',
      '@swc/core': '~1.10.18',
      '@swc/helpers': '~0.5.15',
      '@types/jest': '^29.5.14',
      '@types/node': '^22.13.4',
      '@typescript-eslint/eslint-plugin': '^8.25.0',
      '@typescript-eslint/parser': '^8.25.0',
      '@typescript-eslint/utils': '^8.13.0',
      'angular-eslint': '^19.2.0',
      eslint: '^9.9.1',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-import': '^2.31.0',
      jest: '^29.7.0',
      'jest-environment-jsdom': '^29.7.0',
      'jest-preset-angular': '~14.5.1',
      nx: '~20.3.4',
      prettier: '^3.5.1',
      'ts-jest': '^29.2.5',
      'ts-node': '^10.9.2',
      tslib: '^2.8.1',
      'typescript-eslint': '^8.13.0',
    }

    angularDependencies.forEach((dep) => {
      json.dependencies[dep] = '^19.0.7'
    })
    onecxDependencies.forEach((dep) => {
      json.dependencies[dep] = '^6.0.0'
    })
    ngrxDependencies.forEach((dep) => {
      json.dependencies[dep] = '^19.0.1'
    })
    angularDevDependencies.forEach((dep) => {
      json.devDependencies[dep] = '~19.0.0'
    })
    nxDevDependencies.forEach((dep) => {
      json.devDependencies[dep] = '~20.3.4'
    })

    Object.keys(dependenciesToUpdate).forEach((dep) => {
      if (json.dependencies[dep]) {
        json.dependencies[dep] = dependenciesToUpdate[dep]
      }
    })

    Object.keys(devDependenciesToUpdate).forEach((dep) => {
      if (json.devDependencies[dep]) {
        json.devDependencies[dep] = devDependenciesToUpdate[dep]
      }
    })

    return json
  })

  addGitignoreEntry(tree, '/src/app/shared/generated')

  execSync('npm run apigen', {
    cwd: rootPath,
    stdio: 'inherit',
  })

  removeOnecxKeycloakAuth(tree, srcDirectoryPath)
  removeOnecxPortalLayoutStyles(tree)
  migrateApiConfigProviderUtils(tree, srcDirectoryPath)
  migrateFilterTypes(tree, srcDirectoryPath)
  migrateFastDeepEqualImport(tree, srcDirectoryPath)
  migratePrimeng(tree)
  migratePrimeNgCalendar(tree, srcDirectoryPath)
  migrateStandaloneShell(tree, srcDirectoryPath)

  warnUserServiceHasPermission(tree, srcDirectoryPath)
  warnOcxPortalViewport(tree, srcDirectoryPath)

  removePortalIntegrationAngular(tree, srcDirectoryPath)

  await formatFiles(tree)

  removeGitignoreEntry(tree, '/src/app/shared/generated')
}

function removeOnecxKeycloakAuth(tree: Tree, directoryPath: string) {
  removeDependenciesFromPackageJson(tree, ['@onecx/keycloak-auth'], [])

  removeImportsByModuleSpecifier(tree, directoryPath, '@onecx/keycloak-auth')

  const webpackConfigJsPath = 'webpack.config.js'
  const webpackConfigJsContent = tree.read(webpackConfigJsPath, 'utf-8')

  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(
      /'@onecx\/keycloak-auth':\s*{\s*requiredVersion:\s*'auto',\s*includeSecondaries:\s*true\s*,?\s*},?/g,
      ''
    )

    tree.write(webpackConfigJsPath, updatedContent)
  } else {
    console.error('Cannot find webpack.config.js')
  }

  const keycloakModuleQuery = `Identifier[name="KeycloakAuthModule"]`
  replaceInFiles(tree, directoryPath, keycloakModuleQuery, '')
}

function removeOnecxPortalLayoutStyles(tree: Tree) {
  const warning =
    '⚠️ @onecx/portal-layout-styles library was removed. Please make sure that all references are removed and the application is not relying on @onecx/portal-layout-styles style sheets.'

  const warnOptions = {
    warn: true,
    warning,
    contentCondition: PORTAL_LAYOUT_STYLES,
  }

  const rootPath = '.'

  removeDependenciesFromPackageJson(tree, [PORTAL_LAYOUT_STYLES], [])

  removeOnecxPortalLayoutStylesImportsFromStyleSheets(tree, rootPath, warnOptions)

  removeOnecxPortalLayoutStylesFromJsonFiles(tree, rootPath, warnOptions)

  removeOnecxPortalLayoutStylesFromWebpack(tree)
}

function migratePrimeng(tree: Tree) {
  const projectJsonPath = 'project.json'
  const projectJson = readJson(tree, projectJsonPath)

  if (projectJson.targets.build.options.styles) {
    projectJson.targets.build.options.styles = projectJson.targets.build.options.styles.filter(
      (style: string) => style !== 'node_modules/primeng/resources/primeng.min.css'
    )
  } else {
    console.error('Cannot find styles array in project.json or project.json itself')
  }

  writeJson(tree, projectJsonPath, projectJson)

  replaceImportValuesAndModule(tree, 'src', [
    {
      oldModuleSpecifier: 'primeng/api',
      newModuleSpecifier: 'primeng/config',
      valueReplacements: [{ oldValue: 'PrimeNGConfig', newValue: 'PrimeNG' }],
    },
  ])

  const primengConfigClassQuery = `Identifier[name="PrimeNGConfig"]`
  replaceInFiles(tree, 'src', primengConfigClassQuery, 'PrimeNG')
}

function migrateApiConfigProviderUtils(tree: Tree, directoryPath: string) {
  const searchQuery = `NewExpression:has(Identifier[name="PortalApiConfiguration"])`

  removeImportValuesFromModule(
    tree,
    directoryPath,
    '@onecx/portal-integration-angular',
    ['AppStateService', 'ConfigurationService'],
    searchQuery
  )

  removeParameters(tree, directoryPath, ['ConfigurationService', 'AppStateService'], searchQuery)
}

function migrateFilterTypes(tree: Tree, directoryPath: string) {
  const queryFiltertypeTruthy = 'PropertyAccessExpression:has(Identifier[name="FilterType"]) Identifier[name="TRUTHY"]'
  replaceInFiles(tree, directoryPath, queryFiltertypeTruthy, 'IS_NOT_EMPTY')
}

function migrateFastDeepEqualImport(tree: Tree, directoryPath: string) {
  replaceImportValues(tree, directoryPath, 'fast-deep-equal', ['equal'], 'equal')
  removeDependenciesFromPackageJson(tree, ['fast-deep-equal'], [])
}

function migratePrimeNgCalendar(tree: Tree, directoryPath: string) {
  replaceImportValuesAndModule(tree, directoryPath, [
    {
      oldModuleSpecifier: 'primeng/calendar',
      newModuleSpecifier: 'primeng/datepicker',
      valueReplacements: [
        { oldValue: 'Calendar', newValue: 'DatePicker' },
        { oldValue: 'CalendarModule', newValue: 'DatePickerModule' },
      ],
    },
  ])

  const calendarQuery = `PropertyDeclaration > Decorator > CallExpression:has(Identifier[name="ViewChildren"]) Identifier[name="Calendar"], TypeReference > Identifier[name="Calendar"]`
  replaceInFiles(tree, directoryPath, calendarQuery, 'DatePicker')

  const calendarModuleQuery = `Identifier[name="CalendarModule"]`
  replaceInFiles(tree, directoryPath, calendarModuleQuery, 'DatePickerModule')

  replaceTagInAngularTemplates(tree, directoryPath, 'p-calendar', 'p-datepicker')
}

function warnUserServiceHasPermission(tree: Tree, srcDirectoryPath: string) {
  const warningHasPermissionCalls =
    '⚠️ UserService hasPermission is now asynchronous. Please adapt the usages accordingly, so that they are handled asynchronously.'
  const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, 'hasPermission', 'UserService')

  if (detectedMethodCalls.size > 0) {
    printWarnings(warningHasPermissionCalls, Array.from(detectedMethodCalls.keys()))
  }
}

function warnOcxPortalViewport(tree: Tree, directoryPath: string) {
  const foundInFiles: string[] = []
  const warning =
    '⚠️ ocx-portal-viewport was removed. Please refer to the standalone guide for adaptations: https://onecx.github.io/docs/guides/current/angular/migrations/enable-standalone/index.html'

  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (hasHtmlTag(tree, filePath, 'ocx-portal-viewport')) {
      foundInFiles.push(filePath)
      printWarnings(warning, foundInFiles)
    }
  })
}

function removeOnecxPortalLayoutStylesFromJsonFiles(
  tree: Tree,
  dirPath: string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  updateJsonFiles(tree, dirPath, (json: any) => removeReferences(json, PORTAL_LAYOUT_STYLES), options)
}

function removeOnecxPortalLayoutStylesImportsFromStyleSheets(
  tree: Tree,
  dirPath: string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  updateStyleSheets(
    tree,
    dirPath,
    (root) => {
      root.walkAtRules('import', (atRule) => {
        if (atRule.params.includes(PORTAL_LAYOUT_STYLES)) {
          atRule.remove()
        }
      })

      return root.toString()
    },
    options
  )
}

function removeOnecxPortalLayoutStylesFromWebpack(tree: Tree) {
  const webpackConfigJsPath = 'webpack.config.js'
  const webpackConfigJsContent = tree.read(webpackConfigJsPath, 'utf-8')

  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(
      /'@onecx\/portal-layout-styles':\s*{\s*requiredVersion:\s*'auto',\s*includeSecondaries:\s*true\s*,?\s*},?/g,
      ''
    )

    tree.write(webpackConfigJsPath, updatedContent)
  }
}

function replaceStandaloneShellInPackage(tree: Tree) {
  removeDependenciesFromPackageJson(tree, ['@onecx/standalone-shell'], [])
  addDependenciesToPackageJson(tree, { '@onecx/angular-standalone-shell': '^6.0.0' }, {})
}

function migrateStandaloneShell(tree: Tree, dirPath: string) {
  replaceStandaloneShellImport(tree, dirPath)
  provideStandaloneProvidersIfModuleUsed(tree, dirPath)
}

function replaceStandaloneShellImport(tree: Tree, dirPath: string) {
  const standaloneShell = '@onecx/standalone-shell'
  const angularStandaloneShell = '@onecx/angular-standalone-shell'
  replaceImportModuleSpecifier(tree, dirPath, standaloneShell, angularStandaloneShell)
  const webpackConfigJsContent = tree.read('webpack.config.js', 'utf-8')
  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(standaloneShell, angularStandaloneShell)
    tree.write('webpack.config.js', updatedContent)
  } else {
    console.error('Cannot find webpack.config.js')
  }
}

function provideStandaloneProvidersIfModuleUsed(tree: Tree, dirPath: string) {
  const module: Module = {
    name: 'StandaloneShellModule',
  }
  const provider: Provider = {
    name: 'provideStandaloneProviders',
    importPath: '@onecx/angular-standalone-shell',
  }

  const variablesWithModule = detectVariablesWithModule(tree, dirPath, module)
  const modules = detectModulesImportingModule(tree, dirPath, module, variablesWithModule)
  const variablesWithProvider = detectVariablesWithProvider(tree, dirPath, provider)
  modules.forEach((moduleName) => {
    addProviderInModuleIfDoesNotExist(tree, moduleName, provider, variablesWithProvider)
    addProviderImportIfDoesNotExist(tree, moduleName.filePath, provider)
  })
}

function removePortalIntegrationAngular(tree: Tree, dirPath: string) {
  replacePortalCoreModule(tree, dirPath)
  replacePortalIntegrationAngularImports(tree, dirPath)
  removePortalIntegrationAngularImports(tree, dirPath)
}