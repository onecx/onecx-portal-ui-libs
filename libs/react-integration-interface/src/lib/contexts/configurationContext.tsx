import { createContext, useContext, useState, useEffect, useMemo, type ReactNode, useRef, useCallback } from 'react'
import { ConfigurationTopic } from '@onecx/integration-interface'
import { firstValueFrom, map, Subscription } from 'rxjs'
import Semaphore from 'ts-semaphore'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'

export interface LibConfig {
  appId: string
  portalId: string
  skipRemoteConfigLoad: boolean
  remoteConfigURL: string
}

export interface Config {
  [key: string]: string
}

interface ConfigurationContextProps {
  config: Config | null
  config$: ConfigurationTopic
  isInitialized: Promise<void>
  getConfig: () => Promise<Config | undefined>
  getProperty: (key: CONFIG_KEY) => Promise<string | undefined>
  setProperty: (key: string, value: string) => Promise<void>
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

    let loadConfigPromise: Promise<Config>

    const inlinedConfig = (window as typeof window & { APP_CONFIG: Config })['APP_CONFIG']
    if (inlinedConfig) {
      console.log(`ENV resolved from injected config`)
      loadConfigPromise = Promise.resolve(inlinedConfig)
    } else {
      if (skipRemoteConfigLoad) {
        console.log(
          '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
        )
        loadConfigPromise = Promise.resolve({
          ...defaultConfigValues,
          skipRemoteConfigLoad: String(defaultConfig.skipRemoteConfigLoad),
        })
      } else {
        try {
          loadConfigPromise = fetch(remoteConfigURL || 'assets/env.json')
            .then((res) => res.json())
            .catch((e) => {
              console.log('Failed to load remote config', e)
              return {}
            })
        } catch (e) {
          console.log('Error while fetching remote config:', e)
          loadConfigPromise = Promise.resolve({})
        }
      }
    }

    try {
      const loadedConfig = await loadConfigPromise
      await configRef.current.publish({ ...defaultConfigValues, ...(loadedConfig ?? {}) })
      return true
    } catch (e) {
      console.log('Failed to load env configuration')
      return false
    }
  }, [defaultConfig])

  const getConfig = useCallback(async (): Promise<Config | undefined> => {
    return firstValueFrom(configRef.current.asObservable())
  }, [])

  const getProperty = useCallback(async (key: CONFIG_KEY): Promise<string | undefined> => {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      console.error('Invalid config key ', key)
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

  return <ConfigurationContext value={contextValue}>{children}</ConfigurationContext>
}

export { ConfigurationProvider, useConfiguration, ConfigurationContext }
