import z from 'zod';
import { withRef, bg, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class CustomGroupColumnSelectorSkeletonSchema {
  private static readonly tokens = {
    border: border.pick({ radius: true }).default({
      radius: "{{primitives.border.radius.none}}",
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    animationBackground: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'customGroupColumnSelectorSkeleton' });
}

export const customGroupColumnSelectorSkeleton = CustomGroupColumnSelectorSkeletonSchema.schema;
