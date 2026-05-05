import { createContext, useContext, useState, useEffect, useMemo, type ReactNode, useRef, useCallback } from 'react'
import { Config, ConfigurationTopic, resolveConfigPayload } from '@onecx/integration-interface'
import { firstValueFrom, map, Subscription } from 'rxjs'
import Semaphore from 'ts-semaphore'
import { CONFIG_KEY } from '../model/config-key.model'
import { createLogger } from '../utils/logger.utils'

/**
 * Default configuration values used for configuration bootstrap.
 */
export interface LibConfig {
  appId: string
  portalId: string
  skipRemoteConfigLoad: boolean
  remoteConfigURL: string
}

/**
 * Configuration context value shape.
 */
interface ConfigurationContextProps {
  config: Config | null
  config$: ConfigurationTopic
  /** Promise resolving when configuration initialization completes. */
  isInitialized: Promise<void>
  /**
   * Fetch the current configuration.
   * @returns resolved configuration.
   */
  getConfig: () => Promise<Config | undefined>
  /**
   * Get a configuration property by key.
   * @param key - configuration key.
   * @returns configuration value or undefined.
   */
  getProperty: (key: CONFIG_KEY) => Promise<string | undefined>
  /**
   * Set a configuration property by key.
   * @param key - configuration key.
   * @param value - configuration value.
   * @returns void when update completes.
   */
  setProperty: (key: string, value: string) => Promise<void>
  /**
   * Initialize configuration loading.
   * @returns true when configuration resolved successfully.
   */
  init: () => Promise<boolean>
}

const ConfigurationContext = createContext<ConfigurationContextProps | null>(null)

/**
 * Hook to access configuration context.
 * Must be used within ConfigurationProvider.
 *
 * @returns Configuration context utilities.
 * @throws Error when used outside ConfigurationProvider.
 */
const useConfiguration = (): ConfigurationContextProps => {
  const context = useContext(ConfigurationContext)
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider')
  }
  return context
}

/**
 * Provides configuration loading and access utilities.
 *
 * @param children - React subtree that consumes configuration context.
 * @param defaultConfig - Default configuration options used when none provided.
 * @returns Provider wrapping the given children.
 */
const ConfigurationProvider = ({
  children,
  defaultConfig = {
    skipRemoteConfigLoad: false,
    remoteConfigURL: 'assets/env.json',
    appId: '',
    portalId: '',
  },
}: {
  children: ReactNode
  defaultConfig?: LibConfig
}) => {
  const [config, setConfig] = useState<Config | null>(null)
  const configRef = useRef(new ConfigurationTopic())
  const subscriptionsRef = useRef<Subscription[]>([])
  const semaphoreRef = useRef(new Semaphore(1))
  const loggerRef = useRef(createLogger('ConfigurationProvider'))

  useEffect(() => {
    const subscription = configRef.current.asObservable().subscribe((nextConfig) => {
      setConfig(nextConfig ?? null)
    })
    subscriptionsRef.current.push(subscription)

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe())
      subscriptionsRef.current = []
      configRef.current.destroy()
    }
  }, [])

  const init = useCallback(async (): Promise<boolean> => {
    const { skipRemoteConfigLoad, remoteConfigURL } = defaultConfig
    const defaultConfigValues: Config = {
      appId: defaultConfig.appId,
      portalId: defaultConfig.portalId,
      skipRemoteConfigLoad: String(defaultConfig.skipRemoteConfigLoad),
      remoteConfigURL: defaultConfig.remoteConfigURL,
    }

    try {
      const { config, source } = await resolveConfigPayload({
        defaultConfig: defaultConfigValues,
        skipRemoteConfigLoad,
        remoteConfigURL,
        loadRemoteConfig: async (url) => {
          try {
            return await fetch(url)
              .then((res) => res.json())
              .catch((e) => {
                loggerRef.current.error('Failed to load remote config', e)
                return {}
              })
          } catch (e) {
            loggerRef.current.error('Error while fetching remote config:', e)
            return {}
          }
        },
      })

      if (source === 'inlined') {
        loggerRef.current.info('ENV resolved from injected config')
      }

      if (source === 'default' && skipRemoteConfigLoad) {
        loggerRef.current.info(
          '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
        )
      }

      await configRef.current.publish({ ...defaultConfigValues, ...(config ?? {}) })
      return true
    } catch (e) {
      loggerRef.current.error('Failed to load env configuration', e)
      return false
    }
  }, [defaultConfig])

  const getConfig = useCallback(async (): Promise<Config | undefined> => {
    return firstValueFrom(configRef.current.asObservable())
  }, [])

  const getProperty = useCallback(async (key: CONFIG_KEY): Promise<string | undefined> => {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      loggerRef.current.error('Invalid config key ', key)
    }
    return firstValueFrom(configRef.current.pipe(map((currentConfig) => currentConfig?.[key])))
  }, [])

  const setProperty = useCallback(async (key: string, value: string) => {
    return semaphoreRef.current.use(async () => {
      const currentValues = await firstValueFrom(configRef.current.asObservable())
      const nextValues = { ...(currentValues ?? {}), [key]: value }
      await configRef.current.publish(nextValues)
    })
  }, [])

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init])

  const contextValue = useMemo(
    () => ({
      config,
      config$: configRef.current,
      isInitialized: configRef.current.isInitialized,
      getConfig,
      getProperty,
      setProperty,
      init,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, init, getConfig, getProperty, setProperty]
  )

  return <ConfigurationContext.Provider value={contextValue}>{children}</ConfigurationContext.Provider>
}

export { ConfigurationProvider, useConfiguration, ConfigurationContext }
