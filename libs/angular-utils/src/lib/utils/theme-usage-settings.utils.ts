import {
  regionKeys,
  RegionOverridesInput,
  ThemePropertiesV2,
  ThemeUsageNameWithSettings,
  ThemeUsageSettings,
} from '@onecx/integration-interface'
import { mergeDeep } from './deep-merge.utils'

export type ThemeUsageSettingsMapper<TUsage extends ThemeUsageNameWithSettings, TResult> = (
  settings: ThemeUsageSettings<TUsage>
) => TResult

/**
 * Resolves V2 theme properties for a specific region by merging matching region overrides
 * into the top-level `primitives` and `usages` branches.
 *
 * @param properties Base V2 theme properties to resolve.
 * @param options Optional resolution options.
 * @param options.regionName Region whose overrides should be merged into the base theme.
 * @returns Resolved theme properties, or `undefined` when no properties were provided.
 */
export function resolveThemePropertiesV2(
  properties: ThemePropertiesV2 | undefined,
  options?: { regionName?: keyof RegionOverridesInput }
): ThemePropertiesV2 | undefined {
  if (!properties) {
    return undefined
  }

  const regionName = options?.regionName
  if (!regionName) {
    return properties
  }

  if (!regionKeys.includes(regionName)) {
    throw new Error(`Invalid region name: ${regionName}. Expected one of: ${regionKeys.join(', ')}`)
  }

  const region = properties.regionOverrides?.[regionName]
  if (!region) {
    return properties
  }

  return {
    ...properties,
    primitives: mergeDeep(properties.primitives ?? {}, region.primitives ?? {}),
    usages: mergeDeep(properties.usages ?? {}, region.usages ?? {}),
  }
}

/**
 * Reads the `settings` object for a single theme usage.
 *
 * @param properties Resolved V2 theme properties to inspect.
 * @param usageName Usage name whose settings should be returned.
 * @returns Usage settings object, or `undefined` when the usage does not define settings.
 */
export function getThemeUsageSettings<TUsage extends ThemeUsageNameWithSettings>(
  properties: ThemePropertiesV2 | undefined,
  usageName: TUsage
): ThemeUsageSettings<TUsage> | undefined {
  return properties?.usages?.[usageName]?.settings as ThemeUsageSettings<TUsage> | undefined
}

/**
 * Reads and maps one theme usage `settings` object into provider-specific component defaults.
 *
 * @param properties Resolved V2 theme properties to inspect.
 * @param usageName Usage name whose settings should be mapped.
 * @param mapper Provider-specific mapping function that converts schema settings into component defaults.
 * @returns Mapped component defaults, or `undefined` when no settings were defined for the usage.
 */
export function mapThemeUsageSettings<TUsage extends ThemeUsageNameWithSettings, TResult>(
  properties: ThemePropertiesV2 | undefined,
  usageName: TUsage,
  mapper: ThemeUsageSettingsMapper<TUsage, TResult>
): TResult | undefined {
  const settings = getThemeUsageSettings(properties, usageName)
  return settings ? mapper(settings) : undefined
}