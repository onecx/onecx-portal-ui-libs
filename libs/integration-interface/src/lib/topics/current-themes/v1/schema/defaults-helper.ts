import * as z from 'zod'

/**
 * Recursively walks a zod object shape and applies `.default(value)` for every
 * key present in the defaults tree. Keys absent from the defaults tree stay
 * `.optional()` — they are filled by the runtime fallback mechanism instead.
 *
 * Nested objects are recursed into. Non-object keys are applied directly.
 *
 * @example
 *   const shape = z.object({ a: z.string().optional(), b: z.string().optional() })
 *   const defaults = { a: 'hello' }  // b is intentionally absent → stays optional
 *   const schemaWithDefaults = applyDefaultsRecursive(shape, defaults)
 *   // → { a: z.string().default('hello'), b: z.string().optional() }
 */
export function applyDefaultsRecursive<Shape extends z.ZodRawShape>(
  shape: z.ZodObject<Shape>,
  defaults: Record<string, unknown>
): z.ZodObject<Shape> {
  const newShape: Record<string, z.ZodTypeAny> = {}

  for (const key of Object.keys(shape.shape)) {
    const fieldSchema = shape.shape[key as keyof Shape] as unknown as z.ZodTypeAny
    if (!(key in defaults)) {
      // No default — keep the original schema as-is (optional)
      newShape[key] = fieldSchema
      continue
    }

    const defaultValue = defaults[key]

    // If the field is itself a zod object and the default value is a plain object, recurse
    if (
      fieldSchema instanceof z.ZodObject &&
      defaultValue !== null &&
      typeof defaultValue === 'object' &&
      !Array.isArray(defaultValue)
    ) {
      newShape[key] = applyDefaultsRecursive(
        fieldSchema as z.ZodObject<z.ZodRawShape>,
        defaultValue as Record<string, unknown>
      )
      continue
    }

    // Otherwise apply .default() directly
    newShape[key] = fieldSchema.default(defaultValue as never)
  }

  // The shape is structurally identical to the input `shape` at runtime — we only
  // swapped individual field schemas for their `.default(...)` equivalents — so it
  // is safe to recover the static `Shape` type that `z.object(newShape)` cannot infer.
  return z.object(newShape) as unknown as z.ZodObject<Shape>
}
