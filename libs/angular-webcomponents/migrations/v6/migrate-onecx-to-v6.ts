import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  readJson,
  removeDependenciesFromPackageJson,
  Tree,
  updateJson,
  visitNotIgnoredFiles,
  writeJson,
} from '@nx/devkit'
import { execSync } from 'child_process'

export default async function migrateOnecxToV6(tree: Tree) {
  const rootPath = tree.root
  const srcDirectoryPath = 'src'
  removeDependenciesFromPackageJson(tree, ['@nx/angular', '@nx/devkit', '@nx/plugin'], [])
  addDependenciesToPackageJson(
    tree,
    { '@primeng/themes': '^19.0.6' },
    { '@nx/angular': '~20.3.4', '@nx/devkit': '~20.3.4', '@nx/plugin': '~20.3.4' }
  )

  updateJson(tree, `package.json`, (json) => {
    const angularDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@angular/'))
    const onecxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@onecx/'))
    const ngrxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@ngrx/'))
    const angularDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@angular/'))
    const nxDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@nx/'))

    const dependenciesToUpdate: Record<string, string> = {
      '@angular/cdk': '^19.0.5',
      '@onecx/nx-plugin': '1.10.0',
      '@ngx-translate/core': '^16.0.4',
      'keycloak-angular': '^19.0.2',
      'ngrx-store-localstorage': '^19.0.0',
      primeng: '^19.0.9',
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
      '@types/node': '22.13.4',
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
      'ts-node': '10.9.2',
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

  execSync('npm run apigen', {
    cwd: rootPath,
    stdio: 'inherit',
  })

  removeOnecxKeycloakAuth(tree)
  migrateApiConfigProviderUtils(tree)
  migrateFilterTypes(tree, srcDirectoryPath)
  migrateFastDeepEqualImport(tree, srcDirectoryPath)
  migratePrimeng(tree)
  migratePrimeNgCalendar(tree, srcDirectoryPath)

  installPackagesTask(tree, true)

  await formatFiles(tree)
}

function removeOnecxKeycloakAuth(tree: Tree) {
  removeDependenciesFromPackageJson(tree, ['@onecx/keycloak-auth'], [])

  const appModulePath = 'src/app/app.module.ts'
  const appModuleContent = tree.read(appModulePath, 'utf-8')

  if (appModuleContent) {
    const updatedContent = appModuleContent
      .replace(/import { KeycloakAuthModule } from '@onecx\/keycloak-auth';?/g, '')
      .replace(/KeycloakAuthModule,?\n/g, '')

    tree.write(appModulePath, updatedContent)
  } else {
    console.error('Cannot find app.module.ts in ', appModulePath)
  }

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

  installPackagesTask(tree, true)
}

function migratePrimeng(tree: Tree) {
  const appEntryPointComponentTsPath = 'src/app/app-entrypoint.component.ts'
  const appEntryPointComponentTsContent = tree.read(appEntryPointComponentTsPath, 'utf-8')
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

  if (appEntryPointComponentTsContent) {
    const updatedContent = appEntryPointComponentTsContent
      .replace("import { PrimeNGConfig } from 'primeng/api';", "import { PrimeNG } from 'primeng/config';")
      .replace(/PrimeNGConfig/g, 'PrimeNG')

    tree.write(appEntryPointComponentTsPath, updatedContent)
  } else {
    console.error('Cannot find app-entrypoint.component.ts in ', appEntryPointComponentTsPath)
  }
}

function migrateApiConfigProviderUtils(tree: Tree) {
  const apiConfigProviderUtilsPath = 'src/app/shared/utils/apiConfigProvider.utils.ts'
  const apiConfigProviderUtilsContent = tree.read(apiConfigProviderUtilsPath, 'utf-8')

  if (apiConfigProviderUtilsContent) {
    const updatedContent = apiConfigProviderUtilsContent
      .replace(
        /import {\n?\s*AppStateService,\n?\s*ConfigurationService,\n?\s*PortalApiConfiguration,?\n?} from '@onecx\/portal-integration-angular';?/,
        "import { PortalApiConfiguration } from '@onecx/portal-integration-angular'"
      )
      .replace(
        /export function apiConfigProvider\(\n?\s*configService: ConfigurationService,\n?\s*appStateService: AppStateService,?\n?\) {\n?\s*return new PortalApiConfiguration\(\n?\s*Configuration,\n?\s*environment.apiPrefix,\n?\s*configService,\n?\s*appStateService,?\n?\s*\);?\n?}/,
        'export function apiConfigProvider() {\n  return new PortalApiConfiguration(Configuration, environment.apiPrefix);\n}'
      )

    tree.write(apiConfigProviderUtilsPath, updatedContent)
  } else {
    console.error('Cannot find app-entrypoint.component.ts in ', apiConfigProviderUtilsPath)
  }
}

function migrateFilterTypes(tree: Tree, directoryPath: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (filePath.endsWith('.ts')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = fileContent.replace(/FilterType\.TRUTHY/g, 'FilterType.IS_NOT_EMPTY')

        tree.write(filePath, updatedContent)
      }
    }
  })
}

function migrateFastDeepEqualImport(tree: Tree, directoryPath: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (filePath.endsWith('.ts')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = fileContent.replace(
          /import \* as equal from 'fast-deep-equal';?/,
          "import equal from 'fast-deep-equal';"
        ).replace(
          /import \* as deepEqual from 'fast-deep-equal';?/,
          "import deepEqual from 'fast-deep-equal';"
        )

        tree.write(filePath, updatedContent)
      }
    }
  })
  removeDependenciesFromPackageJson(tree, ['fast-deep-equal'], [])
}

function migratePrimeNgCalendar(tree: Tree, directoryPath: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (filePath.endsWith('.ts')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = fileContent
          .replace(
            /@ViewChildren\(Calendar\) calendars!: QueryList<Calendar>;?/,
            '@ViewChildren(DatePicker) calendars!: QueryList<DatePicker>;'
          )
          .replace(/import { Calendar } from 'primeng\/calendar';?/, "import { DatePicker } from 'primeng/datepicker';")

        tree.write(filePath, updatedContent)
      }
    }
    if (filePath.endsWith('.module.ts')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = fileContent
          .replace(
            /import { CalendarModule } from 'primeng\/calendar';?/,
            "import { DatePickerModule } from 'primeng/datepicker'"
          )
          .replace(/CalendarModule/g, 'DatePickerModule')

        tree.write(filePath, updatedContent)
      }
    }
    if (filePath.endsWith('.html')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = fileContent.replace(/p-calendar/g, 'p-datepicker')

        tree.write(filePath, updatedContent)
      }
    }
  })
}
