import type { Config } from '../topics/configuration/v1/configuration.topic'

type LoadRemoteConfig = (url: string) => Promise<Config>

type ConfigSource = 'inlined' | 'default' | 'remote'

interface ResolveConfigOptions {
  defaultConfig?: Config
  skipRemoteConfigLoad?: boolean
  remoteConfigURL?: string
  loadRemoteConfig: LoadRemoteConfig
}

interface ResolveConfigPayloadOptions {
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

/**
 * Resolves configuration payload without merging defaults (callers can merge as needed).
 *
 * @param options - Configuration resolution inputs.
 * @returns Resolved config payload and source.
 */
const resolveConfigPayload = async ({
  defaultConfig = {},
  skipRemoteConfigLoad,
  remoteConfigURL,
  loadRemoteConfig,
}: ResolveConfigPayloadOptions): Promise<ResolveConfigResult> => {
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
    config: remoteConfig ?? {},
    source: 'remote',
  }
}

export type { ConfigSource, LoadRemoteConfig, ResolveConfigOptions, ResolveConfigPayloadOptions, ResolveConfigResult }
export { getInlinedConfig, resolveConfig, resolveConfigPayload }
