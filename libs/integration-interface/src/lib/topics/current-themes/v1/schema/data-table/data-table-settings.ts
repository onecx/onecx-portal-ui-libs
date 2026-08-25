import z from 'zod';
import { withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export const dataTableSettings = z
  .object({
    checkboxColumnPosition: withRef(z.enum(['start', 'end'])).default('start'),
    actionColumnPosition: withRef(z.enum(['start', 'end'])).default('end'),
    actionColumnSticky: withRef(z.boolean()).default(false),
  })
  .register(themeSchemaRegistry, { id: 'dataTableSettings' });
