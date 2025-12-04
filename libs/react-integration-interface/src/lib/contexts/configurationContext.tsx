import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';

export interface LibConfig {
  appId: string;
  portalId: string;
  skipRemoteConfigLoad: boolean;
  remoteConfigURL: string;
}

export interface Config {
  [key: string]: string;
}

interface ConfigurationContextProps {
  config: Config | null;
  isInitialized: boolean;
  getProperty: (key: string) => string | undefined;
  setProperty: (key: string, value: string) => Promise<void>;
  init: () => Promise<boolean>;
}

const ConfigurationContext = createContext<ConfigurationContextProps | null>(
  null
);

/**
 * Needs to be used within ConfigurationContext
 */
const useConfiguration = (): ConfigurationContextProps => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      'useConfiguration must be used within a ConfigurationProvider'
    );
  }
  return context;
};

const ConfigurationProvider = ({
  children,
  defaultConfig = {
    skipRemoteConfigLoad: false,
    remoteConfigURL: 'assets/env.json',
    appId: '',
    portalId: '',
  },
}: {
  children: ReactNode;
  defaultConfig?: LibConfig;
}) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const init = async (): Promise<boolean> => {
    const { skipRemoteConfigLoad, remoteConfigURL } = defaultConfig;

    let loadConfigPromise: Promise<Config>;

    const inlinedConfig = (window as typeof window & { APP_CONFIG: Config })[
      'APP_CONFIG'
    ];
    if (inlinedConfig) {
      console.log(`ENV resolved from injected config`);
      loadConfigPromise = Promise.resolve(inlinedConfig);
    } else {
      if (skipRemoteConfigLoad) {
        console.log('📢 TKA001: Remote config load is disabled.');
        loadConfigPromise = Promise.resolve({});
      } else {
        try {
          loadConfigPromise = fetch(remoteConfigURL || 'assets/env.json')
            .then((res) => res.json())
            .catch((e) => {
              console.log('Failed to load remote config', e);
              return {};
            });
        } catch (e) {
          console.log('Error while fetching remote config:', e);
          loadConfigPromise = Promise.resolve({});
        }
      }
    }

    try {
      const loadedConfig = await loadConfigPromise;
      setConfig((prev) => ({ ...prev, ...loadedConfig }));
      setIsInitialized(true);
      return true;
    } catch (e) {
      console.log('Failed to load env configuration');
      setIsInitialized(false);
      return false;
    }
  };

  const getProperty = (key: string): string | undefined => {
    return config?.[key];
  };

  const setProperty = async (key: string, value: string) => {
    if (config) {
      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      config,
      isInitialized,
      getProperty,
      setProperty,
      init,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, isInitialized]
  );

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export { ConfigurationProvider, useConfiguration, ConfigurationContext };
