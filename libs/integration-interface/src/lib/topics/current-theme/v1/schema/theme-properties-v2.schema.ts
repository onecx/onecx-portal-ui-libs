import { type $ZodType } from 'zod/v4/core';
import { z } from 'zod';

import { AxisKind } from './axis.model';

interface AxisMarkerMeta {
  axisKind: AxisKind;
  axisName: string;
}

/**
 * Marks a Zod schema node with an axis classification. The marker is stored on
 * the node via Zod's `.meta()` API so that it survives optional/default/nullable
 * wrappers and can be read back by {@link getAxisMeta}.
 *
 * @param schema - The Zod node to classify.
 * @param kind - The axis kind the node represents.
 * @param name - The axis value name contributed by this node (for example `'hover'`).
 * @returns The same schema, unchanged in shape, carrying the axis marker.
 */
export function markAxis<T extends z.ZodType>(schema: T, kind: AxisKind, name: string): T {
  return schema.meta({ axisKind: kind, axisName: name }) as T;
}

/**
 * Reads the axis marker off a Zod schema node.
 *
 * @param schema - The Zod node to inspect.
 * @returns The marker, or `undefined` when the node is unmarked or its metadata is
 *   not a well-formed axis marker.
 */
export function getAxisMeta(schema: $ZodType): AxisMarkerMeta | undefined {
  const meta = (schema as z.ZodType).meta() as { axisKind?: unknown; axisName?: unknown } | undefined;

  if (typeof meta?.axisKind !== 'string' || typeof meta?.axisName !== 'string') {
    return undefined;
  }

  return { axisKind: meta.axisKind as AxisKind, axisName: meta.axisName };
}

const AxisKindEnum = z.enum(['variant', 'state', 'severity', 'child']);

export const ThemePropertiesV2Schema = z.object({
  primitives: z.record(z.string(), z.unknown()),
  usages: z.record(z.string(), z.unknown()),
  regionOverrides: z
    .record(
      z.string(),
      z.object({
        primitives: z.record(z.string(), z.unknown()),
        usages: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  fallbackOrder: z.array(AxisKindEnum).optional(),
});

export type ThemePropertiesV2 = z.infer<typeof ThemePropertiesV2Schema>;
