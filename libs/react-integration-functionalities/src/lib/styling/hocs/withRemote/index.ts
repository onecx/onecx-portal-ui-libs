import { ComponentType } from 'react';
import { withBaseProviders } from '../../../utils/withBaseProviders';
import { withRemotesPrimereactStylesIsolation } from '../withRemotesPrimereactStylesIsolation';
import { composeProviders } from '../../../utils/composeProviders';
import { withRemoteStyles } from '../withRemoteStyles';
import { withAppGlobals } from '../../../utils/withAppGlobals';

interface AppGlobals {
  PRODUCT_NAME: string;
  REMOTES_NAME: string;
  [key: string]: string | number | boolean;
}

export const withRemote = <P extends object>(
  Component: ComponentType<P>,
  appGlobals: AppGlobals,
) =>
  composeProviders<P>(
    (Component: ComponentType) => withAppGlobals(Component, appGlobals),
    withRemoteStyles,
    withRemotesPrimereactStylesIsolation,
    withBaseProviders,
  )(Component);
