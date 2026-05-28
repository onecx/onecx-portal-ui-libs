import * as z from "zod";

export type DeepPartial<T> =
  T extends (infer U)[] ? DeepPartial<U>[] :
  T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } :
  T;

export type DeepPartialSchema<S extends z.ZodTypeAny> = z.ZodType<DeepPartial<z.input<S>>>;

export function deepPartialSchema<S extends z.ZodTypeAny>(
  schema: S
): DeepPartialSchema<S> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const partialShape: Record<string, z.ZodTypeAny> = {};
    for (const key in shape) {
      const childSchema = shape[key] as z.ZodTypeAny;
      partialShape[key] = deepPartialSchema(childSchema).optional();
    }
    return z.object(partialShape) as any;
  }

  if (schema instanceof z.ZodArray) {
    const elementSchema = schema.element as z.ZodTypeAny;
    return z.array(deepPartialSchema(elementSchema)) as any;
  }

  return schema as any;
}