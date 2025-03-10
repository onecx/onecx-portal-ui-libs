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
    const angularPackages = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@angular/'))
    const onecxPackages = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@onecx/'))
    const ngrxPackages = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@ngrx/'))
    const angularDevPackages = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@angular/'))
    const nxDevPackages = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@nx/'))

    angularPackages.forEach((pkg) => {
      json.dependencies[pkg] = '^19.0.7'
    })
    onecxPackages.forEach((pkg) => {
      json.dependencies[pkg] = '^6.0.0-rc.4'
    })
    ngrxPackages.forEach((pkg) => {
      json.dependencies[pkg] = '^19.0.1'
    })
    angularDevPackages.forEach((pkg) => {
      json.devDependencies[pkg] = '~19.0.0'
    })
    nxDevPackages.forEach((pkg) => {
      json.devDependencies[pkg] = '~20.3.4'
    })

    json.dependencies['@angular/cdk'] = '^19.0.5'
    json.dependencies['@onecx/angular-accelerator'] = '^6.0.0-rc.75'
    json.dependencies['@onecx/nx-plugin'] = '1.10.0'
    json.dependencies['@ngx-translate/core'] = '^16.0.4'
    json.dependencies['keycloak-angular'] = '^19.0.2'
    json.dependencies['ngrx-store-localstorage'] = '^19.0.0'
    json.dependencies['primeng'] = '^19.0.9'
    json.dependencies['rxjs'] = '~7.8.2'
    json.dependencies['zod'] = '^3.24.2'
    json.dependencies['zone.js'] = '~0.15.0'

    json.devDependencies['@angular-devkit/core'] = '^19.0.0'
    json.devDependencies['@angular-devkit/schematics'] = '^19.0.0'
    json.devDependencies['@angular/cli'] = '~19.0.0'
    json.devDependencies['@angular-eslint/eslint-plugin'] = '^19.2.0'
    json.devDependencies['@angular-eslint/eslint-plugin-template'] = '^19.2.0'
    json.devDependencies['@angular-eslint/template-parser'] = '^19.2.0'
    json.devDependencies['@angular/compiler-cli'] = '^19.0.0'
    json.devDependencies['@angular/language-service'] = '^19.0.0'
    json.devDependencies['@eslint/js'] = '^9.9.1'
    json.devDependencies['@openapitools/openapi-generator-cli'] = '^2.16.3'
    json.devDependencies['@schematics/angular'] = '~19.0.0'
    json.devDependencies['@swc-node/register'] = '~1.10.9'
    json.devDependencies['@swc/core'] = '~1.10.18'
    json.devDependencies['@swc/helpers'] = '~0.5.15'
    json.devDependencies['@types/jest'] = '^29.5.14'
    json.devDependencies['@types/node'] = '22.13.4'
    json.devDependencies['@typescript-eslint/eslint-plugin'] = '^8.25.0'
    json.devDependencies['@typescript-eslint/parser'] = '^8.25.0'
    json.devDependencies['@typescript-eslint/utils'] = '^8.13.0'
    json.devDependencies['angular-eslint'] = '^19.2.0'
    json.devDependencies['eslint'] = '^9.9.1'
    json.devDependencies['eslint-config-prettier'] = '^9.1.0'
    json.devDependencies['jest'] = '^29.7.0'
    json.devDependencies['jest-environment-jsdom'] = '^29.7.0'
    json.devDependencies['jest-preset-angular'] = '~14.5.1'
    json.devDependencies['nx'] = '~19.0.0'
    json.devDependencies['prettier'] = '^3.5.1'
    json.devDependencies['ts-jest'] = '^29.2.5'
    json.devDependencies['ts-node'] = '10.9.2'
    json.devDependencies['tslib'] = '^2.8.1'
    json.devDependencies['typescript-eslint'] = '^8.13.0'

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
