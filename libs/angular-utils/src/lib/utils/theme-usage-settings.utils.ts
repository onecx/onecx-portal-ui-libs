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

  // Work through a shallow structural view of the theme. The merge below operates on the whole
  // `usages` (and `primitives`) object, which — now that usages such as `table`/`calendar` nest
  // their variant/state trees — is too deep for tsc to normalize at these access sites under
  // ng-packagr's partial-compilation mode (TS2589). Casting to a shallow shape keeps the deep
  // types out of this function's type graph; `mergeDeep` is `any`-typed and the concrete
  // `ThemePropertiesV2` type is restored by the final assertion. Runtime behavior is unchanged.
  const source = properties as unknown as {
    primitives?: Record<string, unknown>
    usages?: Record<string, Record<string, unknown>>
    regionOverrides?: Record<
      string,
      { primitives?: Record<string, unknown>; usages?: Record<string, Record<string, unknown>> } | undefined
    >
  }

  const region = source.regionOverrides?.[regionName]
  if (!region) {
    return properties
  }

  return {
    ...source,
    primitives: mergeDeep(source.primitives ?? {}, region.primitives ?? {}),
    usages: mergeDeep(source.usages ?? {}, region.usages ?? {}),
  } as ThemePropertiesV2
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
  // Read `usages` through a shallow record view. Indexing the deep `UsagesInput` type (whose
  // members are the full `z.input` usage shapes, deep via `table`/`calendar`) with the generic
  // `TUsage` forces tsc to normalize that object — overflowing TS's depth budget under ng-packagr's
  // partial-compilation mode (TS2589). The settings type is recovered purely via the cast; the
  // concrete settings type is cheap because `ThemeUsageSettings` sources from the flat per-usage
  // settings schemas.
  const usages = (properties as unknown as {
    usages?: Record<string, { settings?: unknown } | undefined>
  } | undefined)?.usages
  return usages?.[usageName]?.settings as ThemeUsageSettings<TUsage> | undefined
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