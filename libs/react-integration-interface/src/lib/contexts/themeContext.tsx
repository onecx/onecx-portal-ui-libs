import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CurrentThemeTopic, type Theme } from '@onecx/integration-interface';
import { useConfiguration } from './configurationContext';
import { CONFIG_KEY } from '../model/config-key.model';

const defaultThemeServerUrl = 'http://portal-theme-management:8080';

type Value = {
  currentTheme: Theme | null;
  getThemeHref: (themeIdthemeName: string) => string;
};

const ThemeContext = createContext<Value>({
  currentTheme: null,
  getThemeHref: () => '',
});

/**
 * Needs to be used within ThemeContext
 */
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { config } = useConfiguration();
  const [currentTheme] = useState<Value['currentTheme']>(null);
  const currentTheme$ = useMemo(() => new CurrentThemeTopic(), []);
  const getThemeHref: Value['getThemeHref'] = (themeId) => {
    const themeServerUrl =
      config?.[CONFIG_KEY.TKIT_PORTAL_THEME_SERVER_URL] ||
      defaultThemeServerUrl;
    return `${themeServerUrl}/themes/${themeId}/${themeId}.min.css`;
  };

  const contextValue = useMemo(
    () => ({
      currentTheme,
      getThemeHref,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTheme]
  );

  useEffect(() => {
    return () => {
      currentTheme$.destroy();
    };
  }, [currentTheme$]);
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, useTheme };
