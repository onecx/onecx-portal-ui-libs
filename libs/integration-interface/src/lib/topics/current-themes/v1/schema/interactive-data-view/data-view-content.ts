import z from 'zod';
import { withRef, color, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataViewContentSchema {

  private static readonly borderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly focusRingTokens = {
    color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}"),
    style: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}"),
    width: withRef(z.string()).default("{{primitives.focusRing.width.none}}"),
    radius: withRef(z.string()).default("{{primitives.focusRing.radius.none}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset.none}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow.none}}"),
  }

  private static readonly tokens = {
    border: border.default(this.borderTokens),
    focusRing: z.object({
      ...this.focusRingTokens,
    }).prefault({}),
    paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    justifyContent: withRef(z.string()).default("center"),
    alignContent: withRef(z.string()).default("center")
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'dataViewContent' });
}

export const dataViewContent = DataViewContentSchema.schema;
