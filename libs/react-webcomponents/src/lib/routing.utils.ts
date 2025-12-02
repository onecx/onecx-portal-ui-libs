import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  useAppState,
  useConfiguration,
} from '../../../react-integration-interface/src';

const normalizeHref = (appBaseHref: string, baseHref: string): string => {
  const cleanedAppBaseHref = appBaseHref.replace(/\/$/, '');
  const cleanedBaseHref = baseHref.replace(/^\//, '');
  const normalizedHref = `${cleanedAppBaseHref}/${cleanedBaseHref}`;
  return removeTrailingSlash(normalizedHref);
};
const removeTrailingSlash = (url: string): string => {
  return url.replace(/\/$/, '');
};

/**
 * Needs to be used within Configuration and AppState Contexts
 * returns baseUrl, appBaseHref and href
 */
export const useAppHref = () => {
  const { currentMfe$, currentWorkspace$ } = useAppState();
  const { config } = useConfiguration();
  const [hrefs, setHrefs] = useState({
    baseUrl: '',
    appBaseHref: '',
    baseHref: '',
  });

  useEffect(() => {
    const fetchBaseHref = async () => {
      const baseHref: string = currentMfe$
        ? await firstValueFrom(
            currentMfe$.pipe(map((data) => data.baseHref || '')),
          )
        : '';
      const baseUrl: string = currentWorkspace$
        ? await firstValueFrom(
            currentWorkspace$.pipe(map((data) => data.baseUrl || '')),
          )
        : '';
      const appBaseHref = config?.APP_BASE_HREF ?? '';

      setHrefs({ baseUrl, appBaseHref, baseHref });
    };

    fetchBaseHref();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMfe$, config]);

  const href = normalizeHref(hrefs.appBaseHref, hrefs.baseHref);

  return {
    baseUrl: hrefs.baseUrl,
    appBaseHref: removeTrailingSlash(hrefs.appBaseHref),
    href,
  };
};
