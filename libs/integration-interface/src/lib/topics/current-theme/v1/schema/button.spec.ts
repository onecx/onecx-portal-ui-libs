/**
 * @jest-environment node
 */

import { buttonUsageSchema } from './button.schema';

describe('button.schema', () => {
  it('should parse an empty object successfully', () => {
    expect(buttonUsageSchema.parse({})).toEqual({});
  });

  it('should allow setting outlined.hover.success.background', () => {
    const parsed = buttonUsageSchema.parse({
      outlined: {
        hover: {
          success: { background: 'red' },
        },
      },
    });

    expect(parsed.outlined?.hover?.success?.background).toBe('red');
  });

  it('should allow setting the nested icon child color under the outlined base combination', () => {
    const parsed = buttonUsageSchema.parse({
      outlined: {
        defaultState: {
          defaultSeverity: {
            icon: {
              defaultVariant: {
                defaultState: {
                  defaultSeverity: { color: 'blue' },
                },
              },
            },
          },
        },
      },
    });

    expect(
      parsed.outlined?.defaultState?.defaultSeverity?.icon?.defaultVariant?.defaultState?.defaultSeverity?.color,
    ).toBe('blue');
  });

  it('should allow setting text.defaultState.defaultSeverity.background independently of any icon child', () => {
    const parsed = buttonUsageSchema.parse({
      text: {
        defaultState: {
          defaultSeverity: { background: 'green' },
        },
      },
    });

    expect(parsed.text?.defaultState?.defaultSeverity?.background).toBe('green');
    expect(parsed.outlined).toBeUndefined();
  });
});
