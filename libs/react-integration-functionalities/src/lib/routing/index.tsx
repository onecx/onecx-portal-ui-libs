import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import {
  CurrentLocationTopic,
  CurrentLocationTopicPayload,
} from '@onecx/integration-interface';

const initValue = {
  url: '',
  isFirst: true,
};

export const SyncedLocationContext =
  createContext<CurrentLocationTopicPayload>(initValue);

const RouterSync: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocationTopicPayload>({
      url: locationHook.pathname,
      isFirst: false,
    });

  useEffect(() => {
    const locationSubscription = new CurrentLocationTopic().subscribe(
      (location) => {
        if (locationHook.pathname !== location.url) {
          setCurrentLocation(() => {
            console.log('LOCATION_HOOK RENDER: ', locationHook.pathname);

            locationHook.pathname = location.url ?? locationHook.pathname;
            const newValue = {
              url: locationHook.pathname,
              isFirst: location.isFirst,
            };
            navigate(newValue.url, { replace: true });
            return newValue;
          });
        }
      }
    );

    return () => {
      locationSubscription.unsubscribe();
    };
  }, []);

  return (
    <SyncedLocationContext.Provider value={currentLocation}>
      {children}
    </SyncedLocationContext.Provider>
  );
};

export const SyncedRouterProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <BrowserRouter>
      <RouterSync>{children}</RouterSync>
    </BrowserRouter>
  );
};
