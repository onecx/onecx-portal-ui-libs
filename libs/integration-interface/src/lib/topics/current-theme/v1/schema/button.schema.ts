import { z } from 'zod';

import { markAxis } from './theme-properties-v2.schema';

const severityLeafSchema = () => z.object({ background: z.string().optional() });

const iconChildSchema = markAxis(
  z.object({
    defaultVariant: markAxis(
      z.object({
        defaultState: markAxis(
          z.object({
            defaultSeverity: markAxis(z.object({ color: z.string().optional() }), 'severity', 'defaultSeverity')
              .optional(),
          }),
          'state',
          'defaultState',
        ).optional(),
      }),
      'variant',
      'defaultVariant',
    ).optional(),
  }),
  'child',
  'icon',
);

const severityLeafWithIconSchema = () =>
  z.object({
    background: z.string().optional(),
    icon: iconChildSchema.optional(),
  });

const outlinedVariantSchema = markAxis(
  z.object({
    defaultState: markAxis(
      z.object({
        defaultSeverity: markAxis(severityLeafWithIconSchema(), 'severity', 'defaultSeverity').optional(),
        success: markAxis(severityLeafSchema(), 'severity', 'success').optional(),
      }),
      'state',
      'defaultState',
    ).optional(),
    hover: markAxis(
      z.object({
        defaultSeverity: markAxis(severityLeafSchema(), 'severity', 'defaultSeverity').optional(),
        success: markAxis(severityLeafSchema(), 'severity', 'success').optional(),
      }),
      'state',
      'hover',
    ).optional(),
  }),
  'variant',
  'outlined',
);

const textVariantSchema = markAxis(
  z.object({
    defaultState: markAxis(
      z.object({
        defaultSeverity: markAxis(severityLeafSchema(), 'severity', 'defaultSeverity').optional(),
      }),
      'state',
      'defaultState',
    ).optional(),
  }),
  'variant',
  'text',
);

export const buttonUsageSchema = z.object({
  outlined: outlinedVariantSchema.optional(),
  text: textVariantSchema.optional(),
});

export type ButtonUsage = z.infer<typeof buttonUsageSchema>;
