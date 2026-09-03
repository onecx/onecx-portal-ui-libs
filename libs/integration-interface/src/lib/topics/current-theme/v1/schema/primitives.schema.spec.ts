/**
 * @jest-environment node
 */

import { colorPrimitiveSchema } from './primitives.schema';

describe('primitives.schema', () => {
  it('should fill the base combination with its concrete default values when nothing is provided', () => {
    const parsed = colorPrimitiveSchema.parse({});

    expect(parsed.defaultVariant.defaultState.defaultSeverity.background).toBe('#ffffff');
    expect(parsed.defaultVariant.defaultState.defaultSeverity.text).toBe('#000000');
  });

  it('should let explicit values at the base combination override the defaults', () => {
    const parsed = colorPrimitiveSchema.parse({
      defaultVariant: {
        defaultState: {
          defaultSeverity: {
            background: '#123456',
            text: '#654321',
          },
        },
      },
    });

    expect(parsed.defaultVariant.defaultState.defaultSeverity.background).toBe('#123456');
    expect(parsed.defaultVariant.defaultState.defaultSeverity.text).toBe('#654321');
  });
});
