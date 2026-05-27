import { getOneCXSharedRecommendations, SharedLibraryConfig } from "./get-onecx-shared-recommendations";


/**
 * As we have { platform: 'browser'} in accelerator's & integration-interface project.json.
 * We use dynamic require (provided by Node.js) to read package.json of dependencies, which is not supported in browser environment.
 * So we need to check if the environment is node before using it. So it will only return valid require function while building
 */ 
const nodeRequire = (() => {
  try {
    if (typeof process !== 'undefined' && process?.versions?.node) {
      return (eval('require') as NodeJS.Require);
    }else{
      throw new Error('Node.js environment is required for dynamic require.');
    }
  } catch {
    throw new Error('Node.js environment is required for dynamic require.');
  }
})();

const angularCore = '@angular/core';


/**
 * Callbacks that can be passed to the SharedLibraryConfigOptions function to customize its behavior.
 * @property {function} configCallback - A function that receives the package name and current shared configuration, returning a modified configuration. Must return a SharedLibraryConfig object.
 * @property {function} packageFilterCallback - A function that takes a package name and returns a boolean. Return true to EXCLUDE the package, false to INCLUDE it, undefined or use onecxFilter to use default blacklist. 
*/
export interface SharedLibraryConfigOptions {
  configCallback?: (packageName: string, currentConfig: SharedLibraryConfig) => SharedLibraryConfig;
  packageFilterCallback?: (packageName: string) => boolean | undefined;
}

/**
 * Blacklist of export paths to exclude when generating subpackage entries.
 */
const EXPORTS_BLACKLIST = ['.', './package.json'];

/**
 * Patterns for identifying dependencies that should be blacklisted.
 */
const DEFAULT_DEPENDENCY_BLACKLIST: RegExp[] = [
  /^@nx(\/.*)?$/,
  /^@module-federation(\/.*)?$/,
];

/**
 * For identifying full package paths that should be blacklisted.
 */
const DEFAULT_FULL_PACKAGE_BLACKLIST = [
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

/**
 * Removes the './' prefix from a string, typically used for export paths in package.json files.
 * @param {string} str - The string from which to remove the './' prefix.
 * @returns {string} The string without the './' prefix.
 */
function removeExportPrefix(str: string) {
  return str.replace('./', '');
}


/**
 * The default OneCX package filter.
 * @param {string} packageName - The full package name to check against the default blacklist.
 * @param {Record<string, string>} dependencies - The dependencies object from package.json, used to check if the package is explicitly listed as a dependency.
 * @returns {boolean} - Returns `true` if the package is on the default blacklist, `false` otherwise.
 */
export function onecxFilter(packageName: string, dependencies: Record<string, string>): boolean {
  if (dependencies[packageName]) {
    return isDependencyBlacklisted(packageName); 
  }
  return DEFAULT_FULL_PACKAGE_BLACKLIST.includes(packageName);
}


/**
 * Check whether a dependency matches any blacklist entry. Supports RegExp entries and exact string matches.
 */
function isDependencyBlacklisted(dependency: string, packageFilterCallback?: SharedLibraryConfigOptions['packageFilterCallback']): boolean {
  const filterResult = packageFilterCallback ? packageFilterCallback(dependency) : undefined;
  
  // Explicit true ->  EXCLUDE 
  if (filterResult === true) return true;
  // Explicit false ->  INCLUDE 
  if (filterResult === false) return false;

  // undefined/no callback result: fallback to DEFAULT_DEPENDENCY_BLACKLIST
  return DEFAULT_DEPENDENCY_BLACKLIST.some((entry) => {
    if (entry instanceof RegExp) {
      return entry.test(dependency);
    }
    return entry === dependency;
  });
}

/**
 * Check if a complete package name is blacklisted, using the packageFilterCallback if provided, or falling back to a default blacklist.
 * @param {string} packageName - The full package name to check
 * @param {function} packageFilterCallback - Optional callback that returns true to EXCLUDE, false to INCLUDE, undefined to use default
 * @returns {boolean} true if the package should be blacklisted (excluded), false otherwise
 */
function isFullPackageBlacklisted(
  packageName: string,
  packageFilterCallback?: SharedLibraryConfigOptions['packageFilterCallback']
): boolean {
  const filterResult = packageFilterCallback ? packageFilterCallback(packageName) : undefined;

  // Explicit true ->  EXCLUDE 
  if (filterResult === true) return true;
  // Explicit false ->  INCLUDE 
  if (filterResult === false) return false;

  // undefined/no callback result: fallback to DEFAULT_FULL_PACKAGE_BLACKLIST
  return DEFAULT_FULL_PACKAGE_BLACKLIST.includes(packageName);
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
 * Generates subpackages from a dependency's export entries. Reads the dependency's package.json to find all exported subpackages
 * and creates fully qualified package names.
 * @param {string} dependency - Package name
 * @param {string} version - Package version
 * @returns {Array} Array of subpackage objects with name and version
 */
function generateSubPackageConfig(dependency: string, version: string, packageFilterCallback?: SharedLibraryConfigOptions['packageFilterCallback']) {
  const subpackages : { name: string, requiredVersion: string }[] = [];
  const dependencyPackage = readDependencyPackageJson(dependency);

  if (!dependencyPackage?.exports) {
    return subpackages;
  }

  const exportKeys = Object.keys(dependencyPackage.exports);

  for (const exportKey of exportKeys) {
    if (EXPORTS_BLACKLIST.includes(exportKey)) continue;

    const subpackageName = `${dependency}/${removeExportPrefix(exportKey)}`;
    if (isFullPackageBlacklisted(subpackageName, packageFilterCallback)) continue;
    subpackages.push({ name: subpackageName, requiredVersion: version });
  }
  return subpackages;
}

/**
 * Generates all shared packages (main + subpackages) for a given dependency.
 * Includes the main package plus all exported subpackages.
 * @param {Object} versionMap - Map of dependency names to versions
 * @param {string} dependency - Package name to generate packages for
 * @param {boolean} shouldGenerateSubDeps - Flag indicating whether to include subpackages based on exports
 * @returns {Array} Array of all packages (main + subpackages)
 */
function generatePackageConfig(versionMap : Record<string, string>, dependency : string, shouldGenerateSubDeps : boolean, packageFilterCallback?: SharedLibraryConfigOptions['packageFilterCallback']
): { name: string, requiredVersion: string }[] {
  if (isDependencyBlacklisted(dependency , packageFilterCallback)) {
    return [];
  }
  const allPackages = [];
  const version = versionMap[dependency];
  allPackages.push({ name: dependency, requiredVersion: version });

  if (shouldGenerateSubDeps) {
    const subpackages = generateSubPackageConfig(dependency, version, packageFilterCallback);
    allPackages.push(...subpackages);
  }
  return allPackages;
}


/**
 * Generates Config for all shared library entries as a object for all dependency (main + subpackages(if needed)) for a given dependency.
 * @param {Record<string, string>} dependencies - Map of dependency names to versions
 * @param {boolean} itShouldGenerateSubDeps - Flag indicating whether to include subpackages based on exports
 * @param {GetSharedLibraryConfigOptions} options - Optional callbacks for customizing the configuration generation process. Includes:
 *   - configCallback: A function Callback that adds currentConfig.
 *      configCallback?: (currentConfig: Record<string, any>) => Record<string, any>;
 *   - packageFilterCallback: A function Callback indicating whether the package should be included in the configuration.
 *      packageFilterCallback?: (packageName: string) => boolean;
 * @returns {Array} Array of all packages (main + subpackages)
 * 
 * @example
 * **if shouldGenerateSubDeps is true, the usage will be like:**
 * ```js
 * const sharedConfig = getSharedLibraryConfig(dependencies, true);
 * const config = {
 *   name: 'onecx-test-project-ui',
 *   filename: 'remoteEntry.js',

 * Note: Do not use share() from @angular-architects/module-federation.
 * ```js
 * const sharedEntries = getOneCXSharedLibraryConfig(dependencies, true);odule': './src/main.ts'
 *   },
 *   shared: sharedEntries,
 *   shareScope: 'angular_21'
 * }
 * ```
 * 
 * **if itShouldGenerateSubDeps is false, the usage will be like:**
 * ```js
 * const sharedConfig = getSharedLibraryConfig(dependencies, false);
 * const config = withModuleFederationPlugin({
 *   name: 'onecx-<%= remoteModuleFileName %>-ui',
 *   filename: 'remoteEntryOneCX.js',
 *   exposes: {
 *     './OneCX<%= remoteModuleName %>Module': './src/main.ts'
 *   },
 *   shared: share(sharedEntries),
 * });
 * ```
 * 
 */
export function getOneCXSharedLibraryConfig(dependencies: Record<string, string>, shouldGenerateSubDeps: boolean, options?: SharedLibraryConfigOptions): Record<string, SharedLibraryConfig> {
  
  const allDependencies = Object.keys(dependencies).flatMap((dependency) => {
    return generatePackageConfig(dependencies, dependency, shouldGenerateSubDeps, options?.packageFilterCallback);
  });
  const sharedEntries: Record<string, SharedLibraryConfig> = allDependencies.reduce((acc, packageEntry) => {
    const sharedLibConfig: SharedLibraryConfig = {}
    sharedLibConfig['requiredVersion'] = packageEntry.requiredVersion
    sharedLibConfig['shareScope'] = 'default';    

    const angularCoreVersion = (dependencies[angularCore] || '').split('.')[0].replace('^', '');
    if (angularCoreVersion && parseInt(angularCoreVersion, 10) >= 21) {
      const shareScope = ('angular_').concat(angularCoreVersion);
      sharedLibConfig['shareScope'] = shareScope;
    }

    const onecxRecommendation = getOneCXSharedRecommendations(packageEntry.name, sharedLibConfig);
    if (!onecxRecommendation) {
      return acc;
    }

    // Apply configCallback if provided to current config overriding the recommendation
    const configFromCallback = options?.configCallback ? options.configCallback(packageEntry.name, onecxRecommendation) : undefined;
    if (configFromCallback && typeof configFromCallback === 'object') {
      Object.assign(onecxRecommendation, configFromCallback);
    }

    return {
      ...acc,
      [packageEntry.name]: {
        ...onecxRecommendation,
      },
    };
  }, {});
  return sharedEntries;
}
