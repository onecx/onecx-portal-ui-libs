import { z } from 'zod';

import { markAxis } from './theme-properties-v2.schema';

const severityLeafSchema = () => z.object({ background: z.string().optional() });

const defaultStateSchema = () =>
  markAxis(
    z.object({
      defaultSeverity: markAxis(severityLeafSchema(), 'severity', 'defaultSeverity').optional(),
    }),
    'state',
    'defaultState',
  ).optional();

const hoverStateSchema = () =>
  markAxis(
    z.object({
      defaultSeverity: markAxis(severityLeafSchema(), 'severity', 'defaultSeverity').optional(),
      success: markAxis(severityLeafSchema(), 'severity', 'success').optional(),
    }),
    'state',
    'hover',
  ).optional();

const outlinedVariantSchema = markAxis(
  z.object({
    defaultState: defaultStateSchema(),
    hover: hoverStateSchema(),
  }),
  'variant',
  'outlined',
);

const filledVariantSchema = markAxis(
  z.object({
    defaultState: defaultStateSchema(),
  }),
  'variant',
  'filled',
);

export const inputUsageSchema = z.object({
  outlined: outlinedVariantSchema.optional(),
  filled: filledVariantSchema.optional(),
});

export type InputUsage = z.infer<typeof inputUsageSchema>;
