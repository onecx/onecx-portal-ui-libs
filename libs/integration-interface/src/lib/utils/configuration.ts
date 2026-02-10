import type { Config } from '../topics/configuration/v1/configuration.topic'

type LoadRemoteConfig = (url: string) => Promise<Config>

type ConfigSource = 'inlined' | 'default' | 'remote'

interface ResolveConfigOptions {
  defaultConfig?: Config
  skipRemoteConfigLoad?: boolean
  remoteConfigURL?: string
  loadRemoteConfig: LoadRemoteConfig
}

interface ResolveConfigResult {
  config: Config
  source: ConfigSource
}

/**
 * Returns configuration inlined into the global scope, when available.
 *
 * @returns Inlined configuration payload or undefined.
 */
const getInlinedConfig = (): Config | undefined => {
  return (globalThis as typeof globalThis & { APP_CONFIG?: Config }).APP_CONFIG
}

/**
 * Resolves the configuration payload, preferring inlined config and falling back to default/remote sources.
 *
 * @param options - Configuration resolution inputs.
 * @returns Resolved config and the source it came from.
 */
const resolveConfig = async ({
  defaultConfig = {},
  skipRemoteConfigLoad,
  remoteConfigURL,
  loadRemoteConfig,
}: ResolveConfigOptions): Promise<ResolveConfigResult> => {
  const inlinedConfig = getInlinedConfig()
  if (inlinedConfig) {
    return { config: inlinedConfig, source: 'inlined' }
  }

  if (skipRemoteConfigLoad) {
    return { config: defaultConfig, source: 'default' }
  }

  const resolvedUrl = remoteConfigURL || 'assets/env.json'
  const remoteConfig = await loadRemoteConfig(resolvedUrl)
  return {
    config: { ...defaultConfig, ...(remoteConfig ?? {}) },
    source: 'remote',
  }
}

export type { ConfigSource, LoadRemoteConfig, ResolveConfigOptions, ResolveConfigResult }
export { getInlinedConfig, resolveConfig }
