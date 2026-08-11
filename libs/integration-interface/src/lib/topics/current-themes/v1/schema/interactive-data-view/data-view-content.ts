import z from 'zod';
import { withRef, bg, color, border, focusRingShape } from '../primitives';
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
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.focusRing.radius}}",
    offset: "{{primitives.focusRing.offset}}",
    shadow: "{{primitives.focusRing.shadow}}",
  }

  private static readonly tokens = {
    border: border.default(this.borderTokens),
    focusRing: focusRingShape.default(this.focusRingTokens),
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
