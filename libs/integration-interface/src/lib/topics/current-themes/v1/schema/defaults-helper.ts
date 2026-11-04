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
 *
 * **Scalar-or-scale (union) fields** — a field whose base is a union of a scalar and an object of
 * named tokens (as in the global typography scales) — are the one form filled differently: a
 * *scale* default (a plain object) is applied to the union's object option(s) only, leaving the
 * scalar option(s) untouched so plain strings/refs keep parsing. A scale default therefore lands on
 * the scale branch and fills a partial baseline (a partial input is merged over the filled tokens)
 * without ever synthesizing an entry the author omitted.
 *
 * Everything else — scalars, refs, arrays, and **wrapped objects** (`.prefault`/`.optional` axis
 * wrappers and severity/state blocks) — is handled exactly as before: a *direct* `zod` object is
 * recursed into; anything wrapped (or not an object) gets `.default(value)` applied to the field
 * as-is. That verbatim path is load-bearing: it preserves the registered schema identity of the
 * axis-annotated wrappers, which the relaxed-axis introspection (see `utils/axis-metadata.ts`)
 * relies on to classify the non-default `state`/`severity` keys. Replacing a wrapper with a fresh,
 * unregistered object would drop that classification and corrupt the derived fallback order.
 *
 * The helper is deliberately **field-name agnostic**: it inspects only the *shape* of a schema
 * (object / union / scalar) and the type of the supplied default value, never a key name.
 */
export function applyDefaultsRecursive(
  shape: z.ZodObject,
  defaults: Record<string, unknown>
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const newShape: Record<string, z.ZodTypeAny> = {}

  for (const key of Object.keys(shape.shape)) {
    const fieldSchema = shape.shape[key]
    if (!(key in defaults)) {
      // No default — keep the original schema as-is (optional)
      newShape[key] = fieldSchema
      continue
    }

    const defaultValue = defaults[key]

    // A direct `zod` object filled with a plain object recurses (keys absent from the default stay
    // optional). This is the original behavior and is preserved verbatim.
    if (
      fieldSchema instanceof z.ZodObject &&
      isPlainObjectValue(defaultValue)
    ) {
      newShape[key] = applyDefaultsRecursive(fieldSchema, defaultValue)
      continue
    }

    // The new scalar-or-scale case: the field's base is a union and the default is a scale (object).
    // Fill the object option(s) so the scale branch fills partially; leave the scalar option(s) as-is.
    const base = unwrapToBase(fieldSchema)
    if (base instanceof z.ZodUnion && isPlainObjectValue(defaultValue)) {
      newShape[key] = fillUnionOptions(base, defaultValue)
      continue
    }

    // Everything else (scalars, refs, arrays, wrapped objects, unions with a scalar default) applies
    // the default to the field as-is, preserving the field's schema identity.
    newShape[key] = fieldSchema.default(defaultValue as never)
  }

  return z.object(newShape)
}

/** True for the plain-object default values the recursive fill applies to. */
function isPlainObjectValue(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Builds a union whose object option(s) are filled recursively with `defaultValue` (so a scale
 * default fills a partial baseline) and whose non-object option(s) are left untouched. The filled
 * union carries `defaultValue` as its own default.
 */
function fillUnionOptions(base: z.ZodUnion, defaultValue: Record<string, unknown>): z.ZodTypeAny {
  const options: z.ZodTypeAny[] = (base.options as z.ZodTypeAny[]).map((option: z.ZodTypeAny) => {
    const optionBase = unwrapToBase(option)
    return optionBase instanceof z.ZodObject
      ? applyDefaultsRecursive(optionBase, defaultValue)
      : option
  })
  return z.union(options).default(defaultValue)
}

/**
 * Unwraps `optional` / `prefault` / `default` wrappers to reach the underlying base schema
 * (object / union / scalar). Used only to detect the scalar-or-scale union form; the default is
 * still applied to the original field (or its options), never a freshly unwrapped copy.
 */
function unwrapToBase(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema
  // Bounded: the schemas in this codebase nest wrappers only shallowly.
  for (let i = 0; i < 8; i += 1) {
    const def = (current as unknown as { _def?: { innerType?: z.ZodTypeAny } })._def
    if (def && def.innerType) {
      current = def.innerType
      if (current instanceof z.ZodObject || current instanceof z.ZodUnion) return current
    } else {
      break
    }
  }
  return current
}
