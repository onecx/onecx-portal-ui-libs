/**
 * @jest-environment node
 */

import { inputUsageSchema } from './input.schema';

describe('input.schema', () => {
  it('should parse an empty object with every leaf left undefined', () => {
    const parsed = inputUsageSchema.parse({});

    expect(parsed.outlined?.defaultState?.defaultSeverity?.background).toBeUndefined();
    expect(parsed.outlined?.hover?.defaultSeverity?.background).toBeUndefined();
    expect(parsed.outlined?.hover?.success?.background).toBeUndefined();
    expect(parsed.filled?.defaultState?.defaultSeverity?.background).toBeUndefined();
  });

  it('should allow setting only outlined.hover.success.background while leaving the base combination undefined', () => {
    const parsed = inputUsageSchema.parse({
      outlined: {
        hover: {
          success: { background: 'red' },
        },
      },
    });

    expect(parsed.outlined?.hover?.success?.background).toBe('red');
    expect(parsed.outlined?.defaultState?.defaultSeverity?.background).toBeUndefined();
  });

  it('should allow setting filled.defaultState.defaultSeverity.background independently', () => {
    const parsed = inputUsageSchema.parse({
      filled: {
        defaultState: {
          defaultSeverity: { background: 'blue' },
        },
      },
    });

    expect(parsed.filled?.defaultState?.defaultSeverity?.background).toBe('blue');
    expect(parsed.outlined).toBeUndefined();
  });
});
