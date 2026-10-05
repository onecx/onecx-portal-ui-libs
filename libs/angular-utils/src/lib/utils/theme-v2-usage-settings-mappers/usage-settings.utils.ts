import {
  ThemePropertiesV2,
  ThemeUsageNameWithSettings,
  ThemeUsageSettings,
} from '@onecx/integration-interface'

type ThemeUsageSettingsMapper<TUsage extends ThemeUsageNameWithSettings, TResult> = (
  settings: ThemeUsageSettings<TUsage>
) => TResult

/**
 * Reads the `settings` object for a single theme usage and maps it into provider-specific
 * component defaults.
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
  const settings = properties?.usages?.[usageName]?.settings as ThemeUsageSettings<TUsage> | undefined
  return settings ? mapper(settings) : undefined
}