import { ComponentType } from 'react';
import StyleRegistry from '../../theme/StyleRegistry';

export function withRemoteStyles<P extends object>(
  RemoteComponent: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <StyleRegistry>
      <RemoteComponent {...props} />
    </StyleRegistry>
  );
}
