export type ThemeUsageSettingsTransform<TInput, TOutput> = (value: TInput) => TOutput | undefined

export type ThemeUsageSettingsMappingEntry<TSettings extends object, TResultValue> = {
  [TKey in keyof TSettings]-?: {
    from: TKey
    transform?: ThemeUsageSettingsTransform<TSettings[TKey], TResultValue>
  }
}[keyof TSettings]

export type ThemeUsageSettingsMapDefinition<TSettings extends object, TResult extends object> = {
  [TKey in keyof TResult]: ThemeUsageSettingsMappingEntry<TSettings, TResult[TKey]>
}

export type ThemeUsageSettingsDefinitionMapper<TSettings extends object, TResult extends object> = ((
  settings: TSettings
) => Partial<TResult>) & {
  targetKeys: readonly (keyof TResult)[]
}