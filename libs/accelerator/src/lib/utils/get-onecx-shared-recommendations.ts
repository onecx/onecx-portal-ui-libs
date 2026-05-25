const nodeRequire = (() => {
  try {
    if (typeof process !== 'undefined' && process?.versions?.node) {
      return (eval('require') as NodeJS.Require);
    }else{
      return null;
    }
  } catch {
    return null;
  }
})();

const EXPORTS_BLACKLIST = ['.', './package.json'];

const DEPENDENCY_BLACKLIST = [
  '@nx/angular',
  '@nx/module-federation',
  '@module-federation/enhanced',
  '@module-federation/runtime-core',
  '@module-federation/dts-plugin',
];

const FULL_PACKAGE_BLACKLIST = [
  '@angular/common/locales/global/*',
  '@angular/common/locales/*',
  '@angular/common/upgrade',
  '@angular/core/schematics/*',
  '@angular/core/event-dispatch-contract.min.js',
  '@angular/service-worker/ngsw-worker.js',
  '@angular/service-worker/safety-worker.js',
  '@angular/service-worker/config/schema.json',
  '@angular/router/upgrade',
  '@angular/localize/tools',
  'rxjs/internal/*',
  'primeng/resources/',
  'primeng/editor',
  '@onecx/angular-accelerator/testing',
  '@onecx/angular-accelerator/migrations.json',
];

function removeExportPrefix(str: string) {
  return str.replace('./', '');
}

export interface SharedLibraryConfig {
  singleton?: boolean
  strictVersion?: boolean
  eager?: boolean
  requiredVersion?: string | false
  version?: string
  includeSecondaries?: boolean
  shareScope?: string
}


const sharedLibraryPatterns: RegExp[] = [
  /^@angular.*$/,
  /^@onecx.*$/,
  /^rxjs.*$/,
  /^primeng.*$/,
  /^@ngx-translate.*$/,
  /^@ngrx.*$/,
]

export function getOneCXSharedRecommendations(
  libraryName: string,
  sharedConfig: SharedLibraryConfig
): false | SharedLibraryConfig {
  if (!sharedLibraryPatterns.some((pattern) => pattern.test(libraryName))) {
    return false
  }
  sharedConfig.singleton = false
  sharedConfig.strictVersion = false
  sharedConfig.eager = false
  return sharedConfig
}

/**
 * Resolves and reads a dependency's package.json file.
 * Handles module resolution across npm/yarn/pnpm layouts.
 * @param {string} dependency - Package name to resolve
 * @returns {Object|null} Parsed package.json or null if not found
 */
function readDependencyPackageJson(dependency: string) {
  if (!nodeRequire) return null;
  let packagePath;
  try {
    packagePath = nodeRequire.resolve(`${dependency}/package.json`);
  } catch {
    return null;
  }
  const fs = nodeRequire('fs');
  if (!fs.existsSync(packagePath)) {
    return null;
  }
  const packageContent = fs.readFileSync(packagePath, 'utf-8');
  return JSON.parse(packageContent);
}


/**
 * Generates subpackages from a dependency's export entries.
 * Reads the dependency's package.json to find all exported subpackages
 * and creates fully qualified package names.
 * @param {string} dependency - Package name
 * @param {string} version - Package version
 * @returns {Array} Array of subpackage objects with name and version
 */
function generateSubpackages(dependency: string, version: string) {
  const subpackages : { name: string, requiredVersion: string }[] = [];
  const dependencyPackage = readDependencyPackageJson(dependency);

  if (!dependencyPackage?.exports) {
    return subpackages;
  }

  const exportKeys = Object.keys(dependencyPackage.exports);

  for (const exportKey of exportKeys) {
    if (EXPORTS_BLACKLIST.includes(exportKey)) continue;

    const subpackageName = `${dependency}/${removeExportPrefix(exportKey)}`;
    if (FULL_PACKAGE_BLACKLIST.includes(subpackageName)) continue;

    subpackages.push({ name: subpackageName, requiredVersion: version });
  }

  return subpackages;
}

/**
 * Generates all packages (main + subpackages) for a given dependency.
 * Includes the main package plus all exported subpackages.
 * @param {Object} versionMap - Map of dependency names to versions
 * @param {string} dependency - Package name to generate packages for
 * @returns {Array} Array of all packages (main + subpackages)
 */
function generatePackages(versionMap : Record<string, string>, dependency : string, moduleFederationEnhanced : boolean) {
  if (DEPENDENCY_BLACKLIST.includes(dependency)) {
    return [];
  }
  const allPackages = [];
  const version = versionMap[dependency];
  allPackages.push({ name: dependency, requiredVersion: version });

  if(moduleFederationEnhanced) {
    const subpackages = generateSubpackages(dependency, version);
    allPackages.push(...subpackages);
  }
  return allPackages;
}


/**
 * Generates all sharedEntries as an array of object for all dependency (main + subpackages) for a given dependency.
 * @param {Record<string, string>} dependencies - Map of dependency names to versions
 * @param {boolean} moduleFederationEnhanced - Flag indicating if module-federation/enhanced library is used, which determines if subpackages should be included   
 * @returns {Array} Array of all packages (main + subpackages)
 * 
 * 
 * @example
 * **if moduleFederationEnhanced is true, the usage will be like:**
 * ```js
 * const config = {
 *   name: 'onecx-test-project-ui',
 *   filename: 'remoteEntry.js',
 *   library: { type: 'module' },
 *   exposes: {
 *     './OneCXTestProjectModule': './src/main.ts'
 *   },
 *   shared: sharedEntries,
 *   shareScope: 'angular_21'
 * }
 * ```
 * 
 * **if moduleFederationEnhanced is false, the usage will be like:**
 * ```js
 * const config = withModuleFederationPlugin({
 *   name: 'onecx-<%= remoteModuleFileName %>-ui',
 *   filename: 'remoteEntry.js',
 *   exposes: {
 *     './OneCX<%= remoteModuleName %>Module': './src/main.ts'
 *   },
 *   shared: share(sharedEntries),
 * });
 * ```
 * 
 */
export function getSharedEntries(dependencies: Record<string, string>, moduleFederationEnhanced: boolean): Record<string, SharedLibraryConfig> {
  const allDependencies = Object.keys(dependencies).flatMap((dependency) => {
    return generatePackages(dependencies, dependency, moduleFederationEnhanced);
  });
  const sharedEntries: Record<string, SharedLibraryConfig> = allDependencies.reduce((acc, packageEntry, currentIndex , array ) => {
    const sharedLibConfig: SharedLibraryConfig = {}
    if (moduleFederationEnhanced) {
      sharedLibConfig['shareScope'] = 'angular_21'
      sharedLibConfig['requiredVersion'] = packageEntry.requiredVersion    
    } else {
      sharedLibConfig['includeSecondaries'] = true
      sharedLibConfig['requiredVersion'] = 'auto'
    }
    const onecxRecommendation = getOneCXSharedRecommendations(packageEntry.name, sharedLibConfig);
    if (!onecxRecommendation) {
      return acc;
    }
    return {
      ...acc,
      [packageEntry.name]: {
        ...onecxRecommendation,
      },
    };
  }, {});
  return sharedEntries
}
