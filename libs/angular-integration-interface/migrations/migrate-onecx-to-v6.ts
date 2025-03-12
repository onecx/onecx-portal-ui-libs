import {
  addDependenciesToPackageJson,
  installPackagesTask,
  removeDependenciesFromPackageJson,
  Tree,
  updateJson,
} from '@nx/devkit'
import { execSync } from 'child_process'

export default async function migrateOnecxToV6(tree: Tree) {
  const rootPath = tree.root

  updateJson(tree, `./package.json`, (json) => {
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
      'primeng': '^19.0.9',
      'rxjs': '~7.8.2',
      'zod': '^3.24.2',
      'zone.js': '~0.15.0'
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
      'eslint': '^9.9.1',
      'eslint-config-prettier': '^9.1.0',
      'jest': '^29.7.0',
      'jest-environment-jsdom': '^29.7.0',
      'jest-preset-angular': '~14.5.1',
      'nx': '~19.0.0',
      'prettier': '^3.5.1',
      'ts-jest': '^29.2.5',
      'ts-node': '10.9.2',
      'tslib': '^2.8.1',
      'typescript-eslint': '^8.13.0'
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

    Object.keys(dependenciesToUpdate).forEach(dep => {
      if (json.dependencies[dep]) {
        json.dependencies[dep] = dependenciesToUpdate[dep];
      }
    })

    Object.keys(devDependenciesToUpdate).forEach(dep => {
      if (json.devDependencies[dep]) {
        json.devDependencies[dep] = devDependenciesToUpdate[dep];
      }
    })

    return json
  })

  execSync('npm run apigen', {
    cwd: rootPath,
    stdio: 'inherit',
  })

  removeDependenciesFromPackageJson(tree, ['@onecx/keycloak-auth'], [])
  addDependenciesToPackageJson(tree, { '@primeng/themes': '^19.0.6' }, {})

  installPackagesTask(tree, true)
}
