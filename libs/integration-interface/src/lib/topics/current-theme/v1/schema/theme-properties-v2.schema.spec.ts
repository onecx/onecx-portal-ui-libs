/**
 * @jest-environment node
 */

import { z } from 'zod';

import { getAxisMeta, markAxis, ThemePropertiesV2Schema } from './theme-properties-v2.schema';

describe('theme-properties-v2.schema', () => {
  describe('markAxis / getAxisMeta', () => {
    it('should round-trip an axis marker', () => {
      const marked = markAxis(z.object({ a: z.string() }), 'state', 'hover');
      expect(getAxisMeta(marked)).toEqual({ axisKind: 'state', axisName: 'hover' });
    });

    it('should return undefined for an unmarked schema', () => {
      expect(getAxisMeta(z.object({ a: z.string() }))).toBeUndefined();
    });

    it('should return undefined when the metadata is not a well-formed axis marker', () => {
      const invalid = z.object({ a: z.string() }).meta({ axisKind: 'state' }) as z.ZodType;
      expect(getAxisMeta(invalid)).toBeUndefined();
    });

    it('should preserve normal parse behavior after marking', () => {
      const marked = markAxis(z.object({ a: z.string() }), 'variant', 'outlined');
      expect(marked.parse({ a: 'value' })).toEqual({ a: 'value' });
    });
  });

  describe('ThemePropertiesV2Schema', () => {
    it('should accept an explicit fallbackOrder', () => {
      const doc = {
        primitives: {},
        usages: {},
        fallbackOrder: ['variant', 'state', 'severity'],
      };
      expect(ThemePropertiesV2Schema.parse(doc)).toEqual(doc);
    });

    it('should accept a document without fallbackOrder', () => {
      const doc = { primitives: { color: {} }, usages: { input: {} } };
      expect(ThemePropertiesV2Schema.parse(doc)).toEqual(doc);
    });

    it('should accept a regionOverrides entry', () => {
      const doc = {
        primitives: {},
        usages: {},
        regionOverrides: {
          us: { primitives: { color: {} }, usages: { input: {} } },
        },
      };
      expect(ThemePropertiesV2Schema.parse(doc)).toEqual(doc);
    });

    it('should reject an invalid axis-kind string inside fallbackOrder', () => {
      const doc = {
        primitives: {},
        usages: {},
        fallbackOrder: ['nonsense'],
      };
      expect(() => ThemePropertiesV2Schema.parse(doc)).toThrow();
    });
  });
});
