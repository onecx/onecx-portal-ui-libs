/**
 * Converts a single source setting value for a target field. Return `undefined` to omit the target
 * field. Optional on a mapping entry — when omitted, the source value is copied through unchanged.
 *
 * @param value Raw source setting value.
 * @returns The value to emit for the target field, or `undefined` to omit it.
 */
export type ThemeUsageSettingsTransform<TInput, TOutput> = (value: TInput) => TOutput | undefined

/**
 * Declares how one target field is populated: `from` names the source setting to read and
 * `transform` optionally converts the value (see {@link ThemeUsageSettingsTransform}).
 *
 * The mapped type reduced to a union over `keyof TSettings` pins `from` to each real source key and
 * types `transform` against that key's value, so a wrong source key or mistyped transform is a
 * compile error.
 */
export type ThemeUsageSettingsMappingEntry<TSettings extends object, TResultValue> = {
  [TKey in keyof TSettings]-?: {
    from: TKey
    transform?: ThemeUsageSettingsTransform<TSettings[TKey], TResultValue>
  }
}[keyof TSettings]

/**
 * The complete declarative mapping: one {@link ThemeUsageSettingsMappingEntry} per target field.
 *
 * The type is intentionally non-`Partial`, so every target field must have an entry — a missing
 * entry is a compile error, which prevents silently unmapped settings.
 */
export type ThemeUsageSettingsMapDefinition<TSettings extends object, TResult extends object> = {
  [TKey in keyof TResult]: ThemeUsageSettingsMappingEntry<TSettings, TResult[TKey]>
}

/**
 * Callable mapper produced by {@link defineUsageSettingsMapper}: settings in, a `Partial<TResult>`
 * containing only the fields whose source values were present and not dropped by a transform.
 *
 * `targetKeys` lists the target fields the mapper covers, usable by callers (e.g. specs) to verify
 * they remain a subset of the component's actual inputs.
 */
export type ThemeUsageSettingsDefinitionMapper<TSettings extends object, TResult extends object> = ((
  settings: TSettings
) => Partial<TResult>) & {
  targetKeys: readonly (keyof TResult)[]
}
