import {
  ThemeUsageSettingsMapDefinition,
  ThemeUsageSettingsDefinitionMapper,
  ThemeUsageSettingsTransform,
} from './types'

/**
 * Converts a raw schema value into a boolean when the value is already boolean-typed.
 *
 * @param value Raw schema value to normalize.
 * @returns Boolean value when compatible, otherwise `undefined`.
 */
export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

/**
 * Converts a raw schema value into a number when the value is already number-typed.
 *
 * @param value Raw schema value to normalize.
 * @returns Number value when compatible, otherwise `undefined`.
 */
export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

/**
 * Builds a transform that accepts only literal string values from a fixed set.
 *
 * @param allowedValues Allowed string literal values.
 * @returns Transform that keeps allowed values and drops everything else.
 */
export function asEnum<TValue extends string>(allowedValues: readonly TValue[]): ThemeUsageSettingsTransform<unknown, TValue> {
  return (value) => (typeof value === 'string' && allowedValues.includes(value as TValue) ? (value as TValue) : undefined)
}

/**
 * Builds a transform that maps one set of string literals into another.
 *
 * @param mapping Source-to-target literal mapping table.
 * @returns Transform that maps known values and drops everything else.
 */
export function mapValues<TInput extends string, TOutput>(
  mapping: Partial<Record<TInput, TOutput>>
): ThemeUsageSettingsTransform<unknown, TOutput> {
  return (value) => (typeof value === 'string' ? mapping[value as TInput] : undefined)
}

/**
 * Creates a declarative mapper from theme usage settings to provider-specific component defaults.
 *
 * @param definition Mapping definition describing which source setting populates each target field.
 * @returns Mapper function that emits only defined mapped values and exposes its target keys.
 */
export function defineUsageSettingsMapper<TSettings extends object, TResult extends object>(
  definition: ThemeUsageSettingsMapDefinition<TSettings, TResult>
): ThemeUsageSettingsDefinitionMapper<TSettings, TResult> {
  const mapSettings: ThemeUsageSettingsDefinitionMapper<TSettings, TResult> = (settings) => {
    const result: Partial<TResult> = {}

    for (const [targetKey, entry] of Object.entries(definition) as Array<
      [keyof TResult, ThemeUsageSettingsMapDefinition<TSettings, TResult>[keyof TResult]]
    >) {
      const sourceValue = settings[entry.from]
      const mappedValue = entry.transform
        ? entry.transform(sourceValue)
        : (sourceValue as unknown as TResult[keyof TResult])

      if (mappedValue !== undefined) {
        result[targetKey] = mappedValue
      }
    }

    return result
  }

  mapSettings.targetKeys = Object.keys(definition) as Array<keyof TResult>

  return mapSettings
}
