import { useContext } from 'react';
import { SyncedLocationContext } from '.';

export const useSyncedLocation = () => {
  const context = useContext(SyncedLocationContext);

  if (context === undefined) {
    throw new Error(
      'useSyncedLocation must be used within a SyncedLocationProvider, you probably are not using "withApp" hoc in your app file'
    );
  }

  return context;
};
