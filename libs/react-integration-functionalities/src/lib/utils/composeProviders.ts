import { ComponentType } from 'react';

type HOC<InjectedProps, OriginalProps> = (
  component: ComponentType<OriginalProps & InjectedProps>
) => ComponentType<OriginalProps>;

export const composeProviders =
  <P extends object>(
    ...providers: Array<HOC<any, P>>
  ): ((Component: ComponentType<P>) => ComponentType<P>) =>
  (Component: ComponentType<P>) =>
    providers.reduceRight(
      (AccumulatedComponent, CurrentProvider) =>
        CurrentProvider(AccumulatedComponent),
      Component
    );
