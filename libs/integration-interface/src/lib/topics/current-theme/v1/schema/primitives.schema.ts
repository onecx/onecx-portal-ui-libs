import { z } from 'zod';

import { markAxis } from './theme-properties-v2.schema';

const BASE_BACKGROUND = '#ffffff';
const BASE_TEXT = '#000000';

const baseSeveritySchema = markAxis(
  z.object({
    background: z.string().default(BASE_BACKGROUND),
    text: z.string().default(BASE_TEXT),
  }),
  'severity',
  'defaultSeverity',
).default({ background: BASE_BACKGROUND, text: BASE_TEXT });

const baseStateSchema = markAxis(
  z.object({
    defaultSeverity: baseSeveritySchema,
  }),
  'state',
  'defaultState',
).default({ defaultSeverity: { background: BASE_BACKGROUND, text: BASE_TEXT } });

export const colorPrimitiveSchema = markAxis(
  z.object({
    defaultVariant: markAxis(z.object({ defaultState: baseStateSchema }), 'variant', 'defaultVariant').default({
      defaultState: { defaultSeverity: { background: BASE_BACKGROUND, text: BASE_TEXT } },
    }),
  }),
  'variant',
  'defaultVariant',
);

export type ColorPrimitive = z.infer<typeof colorPrimitiveSchema>;
